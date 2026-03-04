// AI CHANGE: Implemented complete CourseCatalogManager functionality for JSON assignment requirements.
// AI COMMENT: This class now handles data loading, validation, rendering, search/filter caching, modal details, add-course form submission, and JSON export with user-friendly UI feedback.
class CourseCatalogManager {
  /* AI COMMENT: Constructor initializes app state containers (catalog data, filtered results, UI state) and starts setup.
     AI COMMENT: Input/Output: no input arguments; output is a ready-to-use class instance bound to DOM controls. */
  constructor() {
    // AI COMMENT: Existing state properties are preserved and expanded minimally for combined filter/search behavior.
    this.courseCatalog = null;
    this.filteredCourses = [];
    this.currentView = 'all';
    this.searchCache = new Map();

    // AI CHANGE: Added UI and filter state for robust interactions.
    // AI COMMENT: Storing active query/filters lets us correctly combine search + department + credits and rerender from a single source of truth.
    this.activeSearchQuery = '';
    this.activeDepartment = 'all';
    this.activeCredits = 'all';
    this.debounceTimer = null;
    this.modalPreviouslyFocused = null;

    this.initializeApp();
  }

  /* AI COMMENT: Initializes the application startup flow in a safe try/catch wrapper.
     AI COMMENT: Input/Output: no direct input; output is event listeners attached and initial sample load triggered. */
  initializeApp() {
    try {
      // AI CHANGE: Cache DOM once for performance and cleaner code.
      // AI COMMENT: This avoids repeated document queries during frequent UI updates.
      this.cacheDomElements();
      this.setupEventListeners();
      this.loadSampleData();
      this.displayStatistics();
    } catch (error) {
      this.handleError('Application initialization failed', error);
    }
  }

  /* AI COMMENT: Collects frequently-used DOM elements once to avoid repeated queries during rendering and events.
     AI COMMENT: Input/Output: no input; output is this.elements object mapping IDs/classes to nodes. */
  cacheDomElements() {
    // AI COMMENT: Centralized element references used across rendering, messages, modal, and add-course workflows.
    this.elements = {
      searchInput: document.getElementById('searchInput'),
      clearSearchBtn: document.getElementById('clearSearchBtn'),
      departmentFilter: document.getElementById('departmentFilter'),
      creditsFilter: document.getElementById('creditsFilter'),
      loadSampleBtn: document.getElementById('loadSampleBtn'),
      addCourseBtn: document.getElementById('addCourseBtn'),
      exportBtn: document.getElementById('exportBtn'),
      feedbackMessage: document.getElementById('feedbackMessage'),
      addCoursePanel: document.getElementById('addCoursePanel'),
      addCourseForm: document.getElementById('addCourseForm'),
      cancelAddCourseBtn: document.getElementById('cancelAddCourseBtn'),
      formErrors: document.getElementById('formErrors'),
      newDepartment: document.getElementById('newDepartment'),
      coursesContainer: document.getElementById('coursesContainer'),
      totalCourses: document.getElementById('totalCourses'),
      totalDepartments: document.getElementById('totalDepartments'),
      averageEnrollment: document.getElementById('averageEnrollment'),
      courseModal: document.getElementById('courseModal'),
      modalBody: document.getElementById('modalBody'),
      modalContent: document.querySelector('#courseModal .modal-content'),
      closeBtn: document.querySelector('#courseModal .close-btn')
    };
  }

  /* AI COMMENT: Wires UI events to class methods (search, filters, modal, add form, export).
     AI COMMENT: Input/Output: event-driven inputs from user actions; output is state updates and UI rerenders. */
  setupEventListeners() {
    // AI CHANGE: Implemented full event wiring for controls, filters, modal, and form.
    // AI COMMENT: Includes debounced search for better performance on larger datasets and Escape-key modal closing for accessibility.
    this.elements.searchInput.addEventListener('input', () => {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.searchCourses(this.elements.searchInput.value);
      }, 250);
    });

    this.elements.clearSearchBtn.addEventListener('click', () => this.clearSearch());

    this.elements.departmentFilter.addEventListener('change', (event) => {
      this.filterByDepartment(event.target.value);
    });

    this.elements.creditsFilter.addEventListener('change', (event) => {
      this.filterByCredits(event.target.value);
    });

    this.elements.loadSampleBtn.addEventListener('click', () => this.loadSampleData());
    this.elements.exportBtn.addEventListener('click', () => this.exportToJSON());

    this.elements.addCourseBtn.addEventListener('click', () => this.toggleAddCoursePanel());
    this.elements.cancelAddCourseBtn.addEventListener('click', () => this.hideAddCoursePanel());

    this.elements.addCourseForm.addEventListener('submit', (event) => {
      event.preventDefault();
      this.addNewCourse();
    });

    this.elements.coursesContainer.addEventListener('click', (event) => {
      const detailsButton = event.target.closest('.details-btn');
      if (detailsButton) {
        const courseCode = detailsButton.dataset.courseCode;
        this.showCourseDetails(courseCode);
      }
    });

    this.elements.closeBtn.addEventListener('click', () => this.closeModal());

    this.elements.courseModal.addEventListener('click', (event) => {
      if (event.target === this.elements.courseModal) {
        this.closeModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !this.elements.courseModal.classList.contains('hidden')) {
        this.closeModal();
      }
    });
  }

  /* AI COMMENT: Loads sample-data.json from disk using fetch, then forwards raw JSON text to loadCourseData().
     AI COMMENT: Input/Output: no input; output is loaded/validated catalog or a user-visible error message. */
  async loadSampleData() {
    try {
      const response = await fetch('sample-data.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('Could not load sample-data.json');
      }
      const jsonString = await response.text();
      await this.loadCourseData(jsonString);
    } catch (error) {
      this.handleError('Failed to load sample data file', error);
    }
  }

  /* AI COMMENT: Parses a JSON string, validates the catalog structure, stores data, and refreshes UI sections.
     AI COMMENT: Input/Output: input is jsonString text; output is updated app state and rendered course/stat views. 
     Comment: Went through W3 schools information on parsing. Preps and validates json string before converting to js object. */
  async loadCourseData(jsonString) {
    try {
      // AI COMMENT: Prevents runtime parse errors from non-string or empty input.
      if (!jsonString || typeof jsonString !== 'string') {
        throw new Error('Invalid input: JSON string required');
      }

      const data = JSON.parse(jsonString);
      this.validateCatalogStructure(data);

      this.courseCatalog = data;
      this.searchCache.clear();
      this.populateDepartmentOptions();
      this.applyActiveFilters();
      this.displayStatistics();

      this.showSuccessMessage('Course catalog loaded with ' + this.getAllCourses().length + ' courses.');
    } catch (error) {
      this.handleError('Failed to load course data', error);
    }
  }

  /* AI COMMENT: Validates top-level catalog shape before any rendering logic runs.
     AI COMMENT: Input/Output: input is parsed object; output is either success (no return value) or thrown Error with details. */
  validateCatalogStructure(data) {
    const required = ['university', 'semester', 'departments', 'metadata'];
    const missing = required.filter(field => !Object.prototype.hasOwnProperty.call(data, field));

    if (missing.length > 0) {
      throw new Error('Missing required fields: ' + missing.join(', '));
    }

    if (!Array.isArray(data.departments) || data.departments.length === 0) {
      throw new Error('Departments array is required and must contain at least one department');
    }

    data.departments.forEach((dept, index) => {
      if (!dept.code || !dept.name || !Array.isArray(dept.courses)) {
        throw new Error('Department ' + index + ' missing required fields');
      }
    });
  }

  /* AI COMMENT: Flattens nested departments/courses into one searchable list while preserving department metadata.
     AI COMMENT: Input/Output: no direct input; output is an array of normalized course objects. */
  getAllCourses() {
    if (!this.courseCatalog || !Array.isArray(this.courseCatalog.departments)) return [];

    const allCourses = [];
    this.courseCatalog.departments.forEach(dept => {
      (dept.courses || []).forEach(course => {
        allCourses.push({
          ...course,
          departmentCode: dept.code,
          departmentName: dept.name
        });
      });
    });

    return allCourses;
  }

  /* AI COMMENT: Updates current search text and reapplies full filter pipeline.
     AI COMMENT: Input/Output: input query string; output is filteredCourses and refreshed course display. */
  searchCourses(query) {
    // AI CHANGE: Search now updates state and combines with filters via shared pipeline.
    // AI COMMENT: This keeps behavior consistent for search + department + credits combinations and handles empty search gracefully.
    //comment: filters the course code, title, instructions, or topics.
    this.activeSearchQuery = (query || '').trim();
    this.applyActiveFilters();
  }

  /* AI COMMENT: Stores selected department code and reapplies combined filtering logic.
     AI COMMENT: Input/Output: input is department code string or 'all'; output is updated filtered view. 
     comment: implements department specific "active deaprtment" course filterting*/
  filterByDepartment(departmentCode) {
    this.activeDepartment = departmentCode || 'all';
    this.applyActiveFilters();
  }

  /* AI COMMENT: Stores selected credits value and reapplies combined filtering logic.
     AI COMMENT: Input/Output: input is credits string or 'all'; output is updated filtered view. 
     comment: sets the active credit hour filter*/
  filterByCredits(credits) {
    this.activeCredits = credits || 'all';
    this.applyActiveFilters();
  }

  /* AI COMMENT: Core search/filter pipeline that combines search term, department filter, and credits filter.
     AI COMMENT: Tricky logic: search results are cached in Map by lowercase term to avoid recomputing on repeated queries.
     AI COMMENT: Input/Output: no direct parameters; output is this.filteredCourses plus rerendered UI/stat message. */
  applyActiveFilters() {
    const allCourses = this.getAllCourses();
    let workingSet = allCourses;

    const searchTerm = this.activeSearchQuery.toLowerCase();
    if (searchTerm) {
      const cachedResults = this.searchCache.get(searchTerm);
      if (cachedResults) {
        workingSet = cachedResults;
      } else {
        const results = allCourses.filter(course => {
          const code = (course.courseCode || '').toLowerCase();
          const title = (course.title || '').toLowerCase();
          const description = (course.description || '').toLowerCase();
          const instructor = (course.instructor?.name || '').toLowerCase();
          const topics = Array.isArray(course.topics)
            ? course.topics.some(topic => String(topic).toLowerCase().includes(searchTerm))
            : false;
          const departmentName = (course.departmentName || '').toLowerCase();

          return code.includes(searchTerm) ||
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            instructor.includes(searchTerm) ||
            topics ||
            departmentName.includes(searchTerm);
        });

        this.searchCache.set(searchTerm, results);
        workingSet = results;
      }
    }

    if (this.activeDepartment !== 'all') {
      workingSet = workingSet.filter(course => course.departmentCode === this.activeDepartment);
    }

    if (this.activeCredits !== 'all') {
      if (this.activeCredits === '4plus') {
        workingSet = workingSet.filter(course => Number(course.credits) >= 4);
      } else {
        const creditValue = Number(this.activeCredits);
        workingSet = workingSet.filter(course => Number(course.credits) === creditValue);
      }
    }

    this.filteredCourses = workingSet;
    this.displayAllCourses();
    this.updateSearchStats(searchTerm, workingSet.length);
  }

  /* AI COMMENT: Builds one course card DOM node from a course object and computes enrollment badge status.
     AI COMMENT: Input/Output: input is a course object; output is an <article> element ready to append. */
  createCourseCard(course) {
    const cardDiv = document.createElement('article');
    cardDiv.className = 'course-card';
    cardDiv.dataset.courseCode = course.courseCode || '';

    const schedule = course.schedule || {};
    const capacity = Number(schedule.capacity) || 0;
    const enrolled = Number(schedule.enrolled) || 0;
    const enrollmentPercent = capacity > 0 ? Math.round((enrolled / capacity) * 100) : 0;
    const enrollmentStatus = enrollmentPercent >= 90 ? 'full' : enrollmentPercent >= 70 ? 'filling' : 'open';

    const topics = Array.isArray(course.topics) ? course.topics : [];
    const days = Array.isArray(schedule.days) ? schedule.days.join(', ') : 'TBA';

    cardDiv.innerHTML =
      '<div class="course-header">' +
      '<h3 class="course-code">' + (course.courseCode || 'Unknown Course') + '</h3>' +
      '<span class="credits">' + (course.credits ?? 'N/A') + ' credits</span>' +
      '</div>' +
      '<h4 class="course-title">' + (course.title || 'Untitled Course') + '</h4>' +
      '<p class="course-description">' + this.truncateText(course.description || '', 140) + '</p>' +
      '<div class="instructor-info"><strong>Instructor:</strong> ' + (course.instructor?.name || 'TBA') + '</div>' +
      '<div class="schedule-info"><strong>Schedule:</strong> ' + days + ' ' + (schedule.time || 'TBA') + '</div>' +
      '<div class="enrollment-info ' + enrollmentStatus + '">Enrolled: ' + enrolled + '/' + capacity + ' (' + enrollmentPercent + '%)</div>' +
      '<div class="topics">' + topics.map(topic => '<span class="topic-tag">' + topic + '</span>').join('') + '</div>' +
      '<button class="details-btn" type="button" data-course-code="' + (course.courseCode || '') + '">View Details</button>';

    return cardDiv;
  }

  /* AI COMMENT: Renders all currently filtered courses into the grid container.
     AI COMMENT: Tricky logic: uses DocumentFragment so many cards can be appended in one operation for better performance.
     AI COMMENT: Input/Output: no direct input; output is updated DOM in #coursesContainer. 
     Comment: displays the course data by inserting them into the course container. */
  displayAllCourses() {
    const container = this.elements.coursesContainer;
    if (!container) {
      console.error('Courses container not found');
      return;
    }

    container.innerHTML = '';

    if (!Array.isArray(this.filteredCourses) || this.filteredCourses.length === 0) {
      container.innerHTML = '<div class="no-results">No courses found matching your criteria.</div>';
      this.updateDisplayStats();
      return;
    }

    // AI CHANGE: Render via DocumentFragment for efficient DOM updates.
    // AI COMMENT: Building cards in memory and appending once reduces layout thrashing for larger datasets.
    const fragment = document.createDocumentFragment();
    this.filteredCourses.forEach(course => {
      fragment.appendChild(this.createCourseCard(course));
    });

    container.appendChild(fragment);
    this.updateDisplayStats();
  }

  /* AI COMMENT: Finds one course by code and renders full details into the modal.
     AI COMMENT: Input/Output: input is courseCode; output is modal open with complete course information. 
     comment: displays course details and displays error message if course cannot be returned*/
  showCourseDetails(courseCode) {
    const course = this.getAllCourses().find(item => item.courseCode === courseCode);

    if (!course) {
      this.showErrorMessage('Course details could not be found.');
      return;
    }

    const schedule = course.schedule || {};
    const assignments = Array.isArray(course.assignments) ? course.assignments : [];
    const prerequisites = Array.isArray(course.prerequisites) ? course.prerequisites : [];
    const topics = Array.isArray(course.topics) ? course.topics : [];

    this.elements.modalBody.innerHTML =
      '<h2 id="modalTitle">' + (course.courseCode || '') + ' - ' + (course.title || '') + '</h2>' +
      '<p><strong>Department:</strong> ' + (course.departmentName || '') + ' (' + (course.departmentCode || '') + ')</p>' +
      '<p><strong>Credits:</strong> ' + (course.credits ?? 'N/A') + '</p>' +
      '<p><strong>Description:</strong> ' + (course.description || 'N/A') + '</p>' +
      '<p><strong>Prerequisites:</strong> ' + (prerequisites.length ? prerequisites.join(', ') : 'None listed') + '</p>' +
      '<p><strong>Instructor:</strong> ' + (course.instructor?.name || 'TBA') + ' (' + (course.instructor?.email || 'No email') + '), Office: ' + (course.instructor?.office || 'TBA') + '</p>' +
      '<p><strong>Schedule:</strong> ' + (Array.isArray(schedule.days) ? schedule.days.join(', ') : 'TBA') + ' ' + (schedule.time || 'TBA') + ' at ' + (schedule.location || 'TBA') + '</p>' +
      '<p><strong>Capacity:</strong> ' + (schedule.capacity ?? 'N/A') + ', <strong>Enrolled:</strong> ' + (schedule.enrolled ?? 'N/A') + '</p>' +
      '<p><strong>Topics:</strong> ' + (topics.length ? topics.join(', ') : 'None listed') + '</p>' +
      '<h3>Assignments</h3>' +
      '<ul>' +
      (assignments.length
        ? assignments.map(a => '<li>' + a.name + ' - ' + a.points + ' pts (Due: ' + a.dueDate + ')</li>').join('')
        : '<li>No assignments listed.</li>') +
      '</ul>';

    this.modalPreviouslyFocused = document.activeElement;
    this.elements.courseModal.classList.remove('hidden');
    this.elements.courseModal.setAttribute('aria-hidden', 'false');
    this.elements.modalContent.focus();
  }

  /* AI COMMENT: Hides details modal and restores keyboard focus to the element that opened it.
     AI COMMENT: Input/Output: no input; output is accessible modal close behavior. */
  closeModal() {
    this.elements.courseModal.classList.add('hidden');
    this.elements.courseModal.setAttribute('aria-hidden', 'true');
    if (this.modalPreviouslyFocused && typeof this.modalPreviouslyFocused.focus === 'function') {
      this.modalPreviouslyFocused.focus();
    }
  }

  /* AI COMMENT: Computes total courses, total departments, and average enrollment percent across courses.
     AI COMMENT: Input/Output: no input; output is an object { totalCourses, totalDepartments, averageEnrollment }. 
     comment: actually calcualates the enrollment stats*/
  calculateEnrollmentStats() {
    const courses = this.getAllCourses();
    if (!courses.length) {
      return {
        totalCourses: 0,
        totalDepartments: this.courseCatalog?.departments?.length || 0,
        averageEnrollment: 0
      };
    }

    let totalPercent = 0;
    courses.forEach(course => {
      const capacity = Number(course.schedule?.capacity) || 0;
      const enrolled = Number(course.schedule?.enrolled) || 0;
      const percent = capacity > 0 ? (enrolled / capacity) * 100 : 0;
      totalPercent += percent;
    });

    return {
      totalCourses: courses.length,
      totalDepartments: this.courseCatalog?.departments?.length || 0,
      averageEnrollment: Math.round(totalPercent / courses.length)
    };
  }

  /* AI COMMENT: Writes computed enrollment statistics into the three stat number elements in the UI.
     AI COMMENT: Input/Output: no direct input; output is text updates for totals/percentage. 
     comment: writes the calculated enrollment statistics*/
  displayStatistics() {
    const stats = this.calculateEnrollmentStats();
    this.elements.totalCourses.textContent = String(stats.totalCourses);
    this.elements.totalDepartments.textContent = String(stats.totalDepartments);
    this.elements.averageEnrollment.textContent = String(stats.averageEnrollment) + '%';
  }

  /* AI COMMENT: Reads add-course form inputs, validates new course data, and appends valid course to selected department.
     AI COMMENT: Input/Output: inputs come from form fields; output is either validation errors or updated catalog + rerender. 
     comment: processes the form, creates a new object, validates, and prepares it to be added to the department.*/
  addNewCourse() {
    if (!this.courseCatalog) {
      this.showErrorMessage('Load catalog data before adding a course.');
      return;
    }

    const newCourse = {
      courseCode: document.getElementById('newCourseCode').value.trim(),
      title: document.getElementById('newTitle').value.trim(),
      credits: Number(document.getElementById('newCredits').value),
      description: document.getElementById('newDescription').value.trim(),
      prerequisites: this.splitCommaValues(document.getElementById('newPrerequisites').value),
      instructor: {
        name: document.getElementById('newInstructorName').value.trim(),
        email: document.getElementById('newInstructorEmail').value.trim(),
        office: document.getElementById('newInstructorOffice').value.trim()
      },
      schedule: {
        days: this.splitCommaValues(document.getElementById('newScheduleDays').value),
        time: document.getElementById('newScheduleTime').value.trim(),
        location: document.getElementById('newScheduleLocation').value.trim(),
        capacity: Number(document.getElementById('newCapacity').value),
        enrolled: Number(document.getElementById('newEnrolled').value)
      },
      isActive: document.getElementById('newIsActive').value === 'true',
      topics: this.splitCommaValues(document.getElementById('newTopics').value),
      assignments: [
        {
          name: document.getElementById('newAssignmentName').value.trim(),
          points: Number(document.getElementById('newAssignmentPoints').value),
          dueDate: document.getElementById('newAssignmentDueDate').value
        }
      ]
    };

    const validation = this.validateCourseData(newCourse);
    if (!validation.isValid) {
      this.showFormErrors(validation.errors);
      return;
    }

    const selectedDeptCode = this.elements.newDepartment.value;
    const department = this.courseCatalog.departments.find(dept => dept.code === selectedDeptCode);

    if (!department) {
      this.showFormErrors(['Please select a valid department.']);
      return;
    }

    department.courses.push(newCourse);

    // AI COMMENT: Keep metadata in sync only when field exists.
    if (this.courseCatalog.metadata && typeof this.courseCatalog.metadata.totalCourses === 'number') {
      this.courseCatalog.metadata.totalCourses += 1;
    }

    this.searchCache.clear();
    this.hideFormErrors();
    this.elements.addCourseForm.reset();
    this.hideAddCoursePanel();
    this.applyActiveFilters();
    this.displayStatistics();
    this.showSuccessMessage('Course added successfully.');
  }

  /* AI COMMENT: Performs detailed validation checks for required fields, value ranges, and nested objects/arrays.
     AI COMMENT: Input/Output: input is a course object; output is { isValid: boolean, errors: string[] } for UI feedback. 
     comment: validates user input to data fields and returns any error messages*/
  validateCourseData(course) {
    const errors = [];

    const requiredStrings = ['courseCode', 'title', 'description'];
    requiredStrings.forEach(field => {
      if (!course[field] || typeof course[field] !== 'string' || course[field].trim().length === 0) {
        errors.push('Missing or invalid ' + field + '.');
      }
    });

    if (!Number.isInteger(course.credits) || course.credits < 1 || course.credits > 6) {
      errors.push('Credits must be an integer between 1 and 6.');
    }

    if (!course.instructor || typeof course.instructor !== 'object') {
      errors.push('Instructor information is required.');
    } else {
      if (!course.instructor.name || !course.instructor.email || !course.instructor.office) {
        errors.push('Instructor name, email, and office are required.');
      }
      const emailRegex = /^[^\s@]+@hawaii\.edu$/i;
      if (!emailRegex.test(course.instructor.email || '')) {
        errors.push('Instructor email must use the @hawaii.edu domain.');
      }
    }

    if (!course.schedule || typeof course.schedule !== 'object') {
      errors.push('Schedule information is required.');
    } else {
      if (!Array.isArray(course.schedule.days) || course.schedule.days.length === 0) {
        errors.push('Schedule days must be a non-empty array.');
      }
      if (typeof course.schedule.time !== 'string' || !course.schedule.time.trim()) {
        errors.push('Schedule time is required.');
      }
      if (typeof course.schedule.location !== 'string' || !course.schedule.location.trim()) {
        errors.push('Schedule location is required.');
      }
      if (!Number.isInteger(course.schedule.capacity) || course.schedule.capacity < 1) {
        errors.push('Schedule capacity must be a positive integer.');
      }
      if (!Number.isInteger(course.schedule.enrolled) || course.schedule.enrolled < 0) {
        errors.push('Schedule enrolled must be a non-negative integer.');
      }
      if (course.schedule.enrolled > course.schedule.capacity) {
        errors.push('Enrolled students cannot exceed capacity.');
      }
    }

    if (!Array.isArray(course.topics) || course.topics.length === 0) {
      errors.push('At least one topic is required.');
    }

    if (!Array.isArray(course.assignments) || course.assignments.length === 0) {
      errors.push('At least one assignment is required.');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /* AI COMMENT: Serializes current catalog state and triggers a downloadable JSON file export.
     AI COMMENT: Input/Output: no input; output is browser file download with 2-space formatted JSON. 
     comment: converts the course information to JSON and allows users to download the JSON file*/
  exportToJSON() {
    try {
      if (!this.courseCatalog) {
        throw new Error('No catalog data loaded to export.');
      }

      const jsonString = JSON.stringify(this.courseCatalog, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'course-catalog-export.json';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);

      this.showSuccessMessage('Catalog exported successfully.');
    } catch (error) {
      this.handleError('Export failed', error);
    }
  }

  /* AI COMMENT: Populates department dropdown options dynamically from loaded catalog departments.
     AI COMMENT: Input/Output: no input; output is refreshed department options in add form and filter control. */
  populateDepartmentOptions() {
    if (!this.courseCatalog || !Array.isArray(this.courseCatalog.departments)) return;

    const dynamicOptions = this.courseCatalog.departments
      .map(dept => '<option value="' + dept.code + '">' + dept.name + '</option>')
      .join('');

    this.elements.newDepartment.innerHTML = '<option value="">Select department</option>' + dynamicOptions;

    // Preserve "all" and then rebuild available department filters based on current data.
    this.elements.departmentFilter.innerHTML = '<option value="all">All Departments</option>' + dynamicOptions;
    this.elements.departmentFilter.value = this.activeDepartment === 'all' ? 'all' : this.activeDepartment;
  }

  /* AI COMMENT: Toggles visibility of the add-course panel and updates related accessibility state.
     AI COMMENT: Input/Output: no input; output is panel shown/hidden and focus moved appropriately. */
  toggleAddCoursePanel() {
    const isHidden = this.elements.addCoursePanel.classList.contains('hidden');
    if (isHidden) {
      this.elements.addCoursePanel.classList.remove('hidden');
      this.elements.addCourseBtn.setAttribute('aria-expanded', 'true');
      this.elements.newDepartment.focus();
      return;
    }

    this.hideAddCoursePanel();
  }

  /* AI COMMENT: Hides add-course panel and clears any visible validation errors.
     AI COMMENT: Input/Output: no input; output is collapsed form panel in a clean state. */
  hideAddCoursePanel() {
    this.elements.addCoursePanel.classList.add('hidden');
    this.elements.addCourseBtn.setAttribute('aria-expanded', 'false');
    this.hideFormErrors();
  }

  /* AI COMMENT: Displays list of form validation errors to help users correct invalid inputs quickly.
     AI COMMENT: Input/Output: input is array of error strings; output is visible formatted error list in UI. */
  showFormErrors(errors) {
    this.elements.formErrors.classList.remove('hidden');
    this.elements.formErrors.innerHTML = '<strong>Please fix these issues:</strong><ul>' + errors.map(err => '<li>' + err + '</li>').join('') + '</ul>';
  }

  /* AI COMMENT: Clears and hides the form error container after successful validation or cancellation.
     AI COMMENT: Input/Output: no input; output is reset error UI state. */
  hideFormErrors() {
    this.elements.formErrors.classList.add('hidden');
    this.elements.formErrors.innerHTML = '';
  }

  /* AI COMMENT: Updates top feedback message for search context or clears it when no query is active.
     AI COMMENT: Input/Output: inputs are searchTerm and count; output is informational status message. */
  updateSearchStats(searchTerm, count) {
    if (!this.courseCatalog) return;

    if (searchTerm) {
      this.showInfoMessage('Showing ' + count + ' result(s) for "' + searchTerm + '".');
      return;
    }

    this.clearMessage();
  }

  /* AI COMMENT: Small wrapper so display updates route through one stats-rendering function.
     AI COMMENT: Input/Output: no input; output is refreshed statistic numbers. */
  updateDisplayStats() {
    this.displayStatistics();
  }

  /* AI COMMENT: Truncates long text safely for compact card display.
     AI COMMENT: Input/Output: inputs are text and maxLength; output is original or shortened text with ellipsis. */
  truncateText(text, maxLength) {
    if (typeof text !== 'string') return '';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }

  /* AI COMMENT: Resets search and both filters to default states, then reapplies full data pipeline.
     AI COMMENT: Input/Output: no input; output is full unfiltered course list view. */
  clearSearch() {
    // AI CHANGE (REVISION): Clear action now resets search and both filters.
    // AI COMMENT: Assignment requires the Clear button to reset search and filter state together, so this method now restores all three controls to "all/empty" before rerendering.
    this.elements.searchInput.value = '';
    this.activeSearchQuery = '';
    this.activeDepartment = 'all';
    this.activeCredits = 'all';
    if (this.elements.departmentFilter) this.elements.departmentFilter.value = 'all';
    if (this.elements.creditsFilter) this.elements.creditsFilter.value = 'all';
    this.applyActiveFilters();
  }

  /* AI COMMENT: Converts comma-separated form text into a cleaned array, removing empty entries.
     AI COMMENT: Input/Output: input is raw string; output is trimmed string array. */
  splitCommaValues(value) {
    if (!value || typeof value !== 'string') return [];
    return value
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);
  }

  /* AI COMMENT: Central error handler that logs technical details and shows user-friendly feedback in UI.
     AI COMMENT: Input/Output: inputs are message + Error; output is a readable error message for users. */
  handleError(message, error) {
    console.error(message, error);

    let userMessage = message + ': ' + (error?.message || 'Unknown error');
    if (error instanceof SyntaxError) {
      userMessage = 'Invalid JSON format: please check your data structure and try again.';
    }

    this.showErrorMessage(userMessage);
  }

  /* AI COMMENT: Convenience wrapper to display success-style feedback messages. */
  showSuccessMessage(message) {
    this.showMessage(message, 'success');
  }

  /* AI COMMENT: Convenience wrapper to display error-style feedback messages. */
  showErrorMessage(message) {
    this.showMessage(message, 'error');
  }

  /* AI COMMENT: Convenience wrapper to display neutral informational feedback messages. */
  showInfoMessage(message) {
    this.showMessage(message, 'info');
  }

  /* AI COMMENT: Clears and hides the shared feedback message area. */
  clearMessage() {
    this.elements.feedbackMessage.textContent = '';
    this.elements.feedbackMessage.className = 'feedback hidden';
  }

  /* AI COMMENT: Applies message text and visual style class to the shared feedback message element.
     AI COMMENT: Input/Output: inputs are message text and type ('success'|'error'|'info'); output is updated message UI. */
  showMessage(message, type) {
    const box = this.elements.feedbackMessage;
    box.textContent = message;
    box.className = 'feedback ' + type;
  }
}

// AI CHANGE: Preserved DOMContentLoaded bootstrap and added explanation.
// AI COMMENT: Initializes one global manager instance after the page is ready so all required IDs exist before event binding.
document.addEventListener('DOMContentLoaded', function() {
  window.app = new CourseCatalogManager();
});

