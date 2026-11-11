import './Header.css';

interface HeaderProps {
    sticky?: boolean;
}

const Header = ({ sticky = false }: HeaderProps) => {
    return (
        <header className={`header${sticky ? ' header-sticky' : ''}`}>

            <a
                href="/"
                className="header-logo"
            >
                WHATIF
            </a>

            <nav className="header-nav">

                <a
                    href="/#decisions"
                    className="header-nav-link"
                >
                    Decisions
                </a>

                <a
                    href="/#templates"
                    className="header-nav-link"
                >
                    Templates
                </a>

            </nav>

            <button
                type="button"
                className="header-create-button"
                onClick={() => window.location.assign('/decision')}
            >
                <span>+</span>
                새로운 선택
            </button>

        </header>
    );
};

export default Header;
