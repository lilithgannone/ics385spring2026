// AI change: course-catalog-crud
// AI Comment: Adds the minimal course data model and CRUD operations required for dashboard integration and statistics.
// AI change: merged-course-manager-logic
// AI Comment: Integrates the existing basic-json course data/search/filter architecture into the Week 8 dashboard file without creating separate pages.
class CourseCatalogManager {
constructor(catalogData) {
this.courseCatalog = null;
this.filteredCourses = [];
this.searchCache = new Map();
this.activeSearchQuery = '';
this.activeDepartment = 'all';
this.activeCredits = 'all';
if (catalogData) {
this.loadCatalogObject(catalogData);
}
}
// AI change: catalog-load-and-validate
// AI Comment: Preserves existing data-shape validation from the course management system so dashboard uses the same nested JSON model.
loadCatalogObject(data) {
this.validateCatalogStructure(data);
this.courseCatalog = data;
this.searchCache.clear();
this.filteredCourses = this.getAllCourses();
return this.courseCatalog;
}
validateCatalogStructure(data) {
const required = ['university', 'semester', 'departments', 'metadata'];
const missing = required.filter(function(field) { return !Object.prototype.hasOwnProperty.call(data, field); });
if (missing.length > 0) {
throw new Error('Missing required fields: ' + missing.join(', '));
}
if (!Array.isArray(data.departments) || data.departments.length === 0) {
throw new Error('Departments array is required and must contain at least one department');
}
data.departments.forEach(function(dept, index) {
if (!dept.code || !dept.name || !Array.isArray(dept.courses)) {
throw new Error('Department ' + index + ' missing required fields');
}
});
}
getAllCourses() {
if (!this.courseCatalog || !Array.isArray(this.courseCatalog.departments)) return [];
const allCourses = [];
this.courseCatalog.departments.forEach(function(dept) {
(dept.courses || []).forEach(function(course) {
allCourses.push(Object.assign({}, course, {
departmentCode: dept.code,
departmentName: dept.name
}));
});
});
return allCourses;
}
searchCourses(query) {
this.activeSearchQuery = (query || '').trim();
return this.applyActiveFilters();
}
filterByDepartment(departmentCode) {
this.activeDepartment = departmentCode || 'all';
return this.applyActiveFilters();
}
filterByCredits(credits) {
this.activeCredits = credits || 'all';
return this.applyActiveFilters();
}
// AI change: combined-filter-pipeline
// AI Comment: Keeps the same combined search + department + credits behavior as the existing course system for dashboard filtering.
// Comment: Combines the cached text with the dept./ credit filters.
applyActiveFilters() {
const allCourses = this.getAllCourses();
let workingSet = allCourses;
const searchTerm = this.activeSearchQuery.toLowerCase();
if (searchTerm) {
const cachedResults = this.searchCache.get(searchTerm);
if (cachedResults) {
workingSet = cachedResults;
} else {
const results = allCourses.filter(function(course) {
const code = String(course.courseCode || '').toLowerCase();
const title = String(course.title || '').toLowerCase();
const description = String(course.description || '').toLowerCase();
const instructor = String((course.instructor && course.instructor.name) || '').toLowerCase();
const departmentName = String(course.departmentName || '').toLowerCase();
const topics = Array.isArray(course.topics)
? course.topics.some(function(topic) { return String(topic).toLowerCase().includes(searchTerm); })
: false;
return code.includes(searchTerm) || title.includes(searchTerm) || description.includes(searchTerm) || instructor.includes(searchTerm) || departmentName.includes(searchTerm) || topics;
});
this.searchCache.set(searchTerm, results);
workingSet = results;
}
}
if (this.activeDepartment !== 'all') {
workingSet = workingSet.filter((course) => course.departmentCode === this.activeDepartment);
}
if (this.activeCredits !== 'all') {
if (this.activeCredits === '4plus') {
workingSet = workingSet.filter((course) => Number(course.credits) >= 4);
} else {
const creditValue = Number(this.activeCredits);
workingSet = workingSet.filter((course) => Number(course.credits) === creditValue);
}
}
this.filteredCourses = workingSet;
return this.filteredCourses;
}
// AI change: stats-compatible-calculation
// AI Comment: Reuses enrollment math based on schedule.capacity/enrolled so dashboard statistics match existing course data fields.
calculateEnrollmentStats() {
const courses = this.getAllCourses();
if (!courses.length) {
return { totalCourses: 0, totalEnrollment: 0, averageCapacityPercent: 0 };
}
let totalEnrollment = 0;
let totalPercent = 0;
courses.forEach(function(course) {
const capacity = Number(course.schedule && course.schedule.capacity) || 0;
const enrolled = Number(course.schedule && course.schedule.enrolled) || 0;
totalEnrollment += enrolled;
const percent = capacity > 0 ? (enrolled / capacity) * 100 : 0;
totalPercent += percent;
});
return {
totalCourses: courses.length,
totalEnrollment: totalEnrollment,
averageCapacityPercent: Math.round(totalPercent / courses.length)
};
}
getDepartmentsDetailed() {
if (!this.courseCatalog || !Array.isArray(this.courseCatalog.departments)) return [];
return this.courseCatalog.departments.map(function(dept) {
return { code: dept.code, name: dept.name };
});
}
findCourseByCode(courseCode) {
return this.getAllCourses().find(function(course) {
return String(course.courseCode) === String(courseCode);
}) || null;
}
// AI change: compatible-crud-operations
// AI Comment: Adds thin wrappers for add/edit/delete so dashboard actions work while keeping the nested department-based storage model.
// Comment: Ensures that missing fields get default values and that the search cache and filters are updated after changes.
addCourse(course, departmentCode) {
if (!this.courseCatalog || !Array.isArray(this.courseCatalog.departments)) return null;
const targetDepartmentCode = departmentCode || course.departmentCode || (this.courseCatalog.departments[0] && this.courseCatalog.departments[0].code);
const department = this.courseCatalog.departments.find(function(dept) { return dept.code === targetDepartmentCode; });
if (!department) return null;
const normalizedCourse = {
courseCode: course.courseCode || course.id || 'NEW 000',
title: course.title || 'Untitled Course',
credits: Number(course.credits || 3),
description: course.description || 'No description provided.',
prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : [],
instructor: course.instructor || { name: 'TBA', email: 'tba@hawaii.edu', office: 'TBA' },
schedule: course.schedule || {
days: ['TBA'],
time: 'TBA',
location: 'TBA',
capacity: Number(course.capacity || 30),
enrolled: Number(course.enrolled || 0)
},
isActive: typeof course.isActive === 'boolean' ? course.isActive : true,
topics: Array.isArray(course.topics) ? course.topics : [],
assignments: Array.isArray(course.assignments) ? course.assignments : []
};
department.courses.push(normalizedCourse);
if (this.courseCatalog.metadata && typeof this.courseCatalog.metadata.totalCourses === 'number') {
this.courseCatalog.metadata.totalCourses += 1;
}
this.searchCache.clear();
this.applyActiveFilters();
return normalizedCourse;
}
updateCourse(courseCode, updates) {
if (!this.courseCatalog || !Array.isArray(this.courseCatalog.departments)) return null;
let updatedCourse = null;
this.courseCatalog.departments.forEach(function(dept) {
const index = dept.courses.findIndex(function(course) { return String(course.courseCode) === String(courseCode); });
if (index >= 0) {
const existing = dept.courses[index];
dept.courses[index] = Object.assign({}, existing, updates);
updatedCourse = dept.courses[index];
}
});
if (updatedCourse) {
this.searchCache.clear();
this.applyActiveFilters();
}
return updatedCourse;
}
deleteCourse(courseCode) {
if (!this.courseCatalog || !Array.isArray(this.courseCatalog.departments)) return false;
let removed = false;
this.courseCatalog.departments.forEach(function(dept) {
const before = dept.courses.length;
dept.courses = dept.courses.filter(function(course) { return String(course.courseCode) !== String(courseCode); });
if (dept.courses.length < before) removed = true;
});
if (removed && this.courseCatalog.metadata && typeof this.courseCatalog.metadata.totalCourses === 'number') {
this.courseCatalog.metadata.totalCourses = Math.max(0, this.courseCatalog.metadata.totalCourses - 1);
}
if (removed) {
this.searchCache.clear();
this.applyActiveFilters();
}
return removed;
}
}

// AI change: dashboard-compatibility-wrapper
// AI Comment: Preserves current dashboard integration point (`new CourseCatalog(...)`) while routing behavior to merged course manager logic.
class CourseCatalog extends CourseCatalogManager {
constructor(catalogData) {
super(catalogData);
}
getDepartments() {
return this.getDepartmentsDetailed().map(function(dept) { return dept.code; });
}
}

