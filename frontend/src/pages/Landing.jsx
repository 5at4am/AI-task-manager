import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import './Landing.css';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="landing">
      <Navbar />
      
      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">
                Manage Your Tasks,
                <span className="gradient-text">Master Your Day</span>
              </h1>
              <p className="hero-description">
                A simple, powerful task manager to help you stay organized and productive.
                Capture tasks, set priorities, and track your progress.
              </p>
              <div className="hero-actions">
                {user ? (
                  <Link to="/dashboard">
                    <Button variant="primary" size="lg">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button variant="primary" size="lg">
                        Get Started Free
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button variant="ghost" size="lg">
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Everything you need to stay organized</h2>
              <p className="section-description">
                Simple yet powerful features to help you manage your tasks effectively
              </p>
            </div>
            
            <div className="features-grid">
              <Card className="feature-card">
                <div className="feature-icon">✓</div>
                <h3 className="feature-title">Quick Task Creation</h3>
                <p className="feature-description">
                  Add tasks in seconds with our simple and intuitive interface.
                </p>
              </Card>
              
              <Card className="feature-card">
                <div className="feature-icon">🎯</div>
                <h3 className="feature-title">Priority Management</h3>
                <p className="feature-description">
                  Set priorities to focus on what matters most.
                </p>
              </Card>
              
              <Card className="feature-card">
                <div className="feature-icon">📅</div>
                <h3 className="feature-title">Due Dates</h3>
                <p className="feature-description">
                  Never miss a deadline with date tracking and reminders.
                </p>
              </Card>
              
              <Card className="feature-card">
                <div className="feature-icon">📊</div>
                <h3 className="feature-title">Track Progress</h3>
                <p className="feature-description">
                  See your completed tasks and celebrate your achievements.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta">
          <div className="container">
            <Card className="cta-card">
              <div className="cta-content">
                <h2 className="cta-title">Ready to get organized?</h2>
                <p className="cta-description">
                  Start managing your tasks today. It's free and takes less than a minute.
                </p>
                {!user && (
                  <Link to="/signup">
                    <Button variant="primary" size="lg">
                      Create Free Account
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="copyright">
            © 2026 Task Manager. Built with React & FastAPI.
          </p>
        </div>
      </footer>
    </div>
  );
}
