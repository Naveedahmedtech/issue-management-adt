
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-text py-6">
      <div className="container mx-auto px-4 md:px-20">
        <div className="flex flex-col lg:flex-row justify-center items-center text-center lg:justify-between lg:text-left">
          <div className="w-full lg:w-auto order-2 lg:order-1">
            <p>&copy; {currentYear} Naveed Ahmed. All Rights Reserved.</p>
          </div>
          <div className="w-full lg:w-auto order-3 lg:order-2 flex justify-center lg:justify-between items-center mt-6 lg:mt-0">
            {/* {navLinks.map((link, index) => (
              <a key={index} href={link.href} className="nav-link mr-2 last:mr-0">
                {link.name}
              </a>
            ))} */}
          </div>
          <div className="w-full lg:w-auto order-1 lg:order-3 flex flex-col lg:flex-row justify-center items-center mt-6 lg:mt-0">
            <p className="mb-4 lg:mb-0 lg:mr-4">Follow me on:</p>
            <div className="flex justify-center">
              <a href="https://github.com/Naveedahmedtech" target="_blank" rel="noopener noreferrer" className="mr-4 hover:text-primary">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.529 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.112-4.555-4.946 0-1.092.39-1.986 1.029-2.686-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.847c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.398.1 2.651.64.7 1.028 1.594 1.028 2.686 0 3.841-2.339 4.691-4.566 4.939.359.309.678.919.678 1.852 0 1.337-.012 2.419-.012 2.747 0 .267.18.578.688.481A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
              </a>
              <a href="https://www.linkedin.com/in/naveed-dev/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M19 0h-14c-2.8 0-5 2.2-5 5v14c0 2.8 2.2 5 5 5h14c2.8 0 5-2.2 5-5v-14c0-2.8-2.2-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.3c-1 0-1.8-0.8-1.8-1.8s0.8-1.8 1.8-1.8 1.8 0.8 1.8 1.8-0.8 1.8-1.8 1.8zm13.5 12.3h-3v-5.6c0-3.4-4-3.1-4 0v5.6h-3v-11h3v1.5c1.4-2.6 7-2.8 7 2.5v7z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
