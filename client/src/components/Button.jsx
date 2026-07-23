import styles from "../styles/Bottom.module.css";
import PropTypes from "prop-types";
function Button({ text, className, onClick }) {
  return (
    <a className={`${styles.btn} ${className}`} onClick={onClick}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      {text}
    </a>
  );
}

Button.propTypes = {
  text: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

export default Button;
