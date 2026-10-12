import './Header.css';

const Header = () => {
    return (
        <header className="header">

            <a
                href="/"
                className="header-logo"
            >
                WHATIF
            </a>

            <nav className="header-nav">

                <a
                    href="#decisions"
                    className="header-nav-link"
                >
                    Decisions
                </a>

                <a
                    href="#templates"
                    className="header-nav-link"
                >
                    Templates
                </a>

            </nav>

            <button
                type="button"
                className="header-create-button"
            >
                <span>+</span>
                새로운 선택
            </button>

        </header>
    );
};

export default Header;