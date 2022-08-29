import styles from "./Footer.module.css";
import React from "react";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
	return (
		<footer className={styles.footer}>
			<div className={styles.icons}>
				<a
					href={"https://github.com/Mark5013"}
					className={styles.icon}
					data-testid="github-icon">
					<FontAwesomeIcon icon={faGithub} />
				</a>
				<a
					href={"https://www.linkedin.com/in/mark5013/"}
					className={styles.icon}
					data-testid="linkedin-icon">
					<FontAwesomeIcon icon={faLinkedin} />
				</a>
			</div>

			<a className={styles.credit} href="https://clearbit.com">
				Logos provided by Clearbit
			</a>
		</footer>
	);
};

export default Footer;
