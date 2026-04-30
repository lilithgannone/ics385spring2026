//// import React so JSX can be used
import React from "react";

// The copyright footer modeled after the Keeper code. Manually coded.
function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <p>Copyright {"\u00A9"} {currentYear}</p>
    </footer>
  );
}

// make the component available for import in other files
export default Footer;
