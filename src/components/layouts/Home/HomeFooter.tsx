export default function Footer () {

    return (<>
        <footer>
            <div className="footer-flex">
                <nav className="footer-group">                    
                    <div className="footer-links services">
                        <h2>Marketing & Design Services</h2>
                        <a className="footer-link" href="/">Advertising</a>
                        <a className="footer-link" href="/">Copywriting</a>
                        <a className="footer-link" href="/">Designer Websites</a>
                        <a className="footer-link" href="/">E-commerce</a>
                        <a className="footer-link" href="/">Photography</a>
                        <a className="footer-link" href="/">Print & Digital Design</a>
                        <a className="footer-link" href="/">Web App Development</a>
                    </div>
                </nav>
                <nav className="footer-group contact">
                    <div className="footer-links phone">
                        <h2>Phone</h2>
                        <a className="footer-link" href="phone:">355-355-1234</a>
                    </div>

                    <div className="footer-links email">
                        <h2>Inquiries</h2>
                        <a className="footer-link" href="mailto:hello@clockelliptic.com">hello@clockelliptic.com</a>
                    </div>
                    <div className="footer-links social-media">
                        <h2>Connect With Us</h2>
                        <div className="row">
                            <a className="footer-link" href="/">Tw</a>
                            <a className="footer-link" href="/">In</a>
                            <a className="footer-link" href="/">Gh</a>
                            <a className="footer-link" href="/">Pt</a>
                        </div>
                    </div>
                </nav>
                <div className="brand-description">
                    <h1>Clockelliptic<br />Digital</h1>
                    <p>Founded in 2015, Clockelliptic is a creative marketing agency that designs, engineers, and developes evocative brand identities and custom solutions for digital and print marketing media. Our team is based in Pittsburgh, PA.</p>
                </div>
            </div>
            <style jsx>{`
                footer {
                    position: relative;
                    height: 100vh;
                    width: 80%;
                    display: flex;
                    background: #012021;
                    color: #fff;
                    padding-left: 120px;
                    padding-top: 120px;
                }
                .footer-flex {
                    display: flex;
                    padding: 32px;
                }
                .footer-group, .brand-description {
                    flex: 1;
                }
                .footer-group {
                }
                .footer-group.contact {
                    padding-left: 72px;
                }
                .footer-links {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 1rem;
                }
                .footer-links p {
                    margin-top: 0;
                }
                .footer-links h2 {
                    font-size: 1rem;
                    font-weight: 300;
                    color: #D6FBFB;
                }
                .footer-links a {
                    font-weight: 400;
                }
                .footer-link {
                    text-decoration: none;
                    color: #fff;

                }
                .address.footer-links {

                }
                .social-media.footer-links .row {
                    display: flex;
                }
                .social-media.footer-links .footer-link {
                    margin-right: 1rem;
                }
                .brand-description {
                    padding-right: 32px;
                    margin-left: 72px;
                    color: #fff;
                }
                .brand-description h1 {
                    font-size: 2.5rem;
                    color: #fff;
                    margin-top: 12px;
                }
                .brand-description p {
                }
                .brand-description h1, .brand-description p {
                }
            `}</style>
        </footer>
    </>)
}