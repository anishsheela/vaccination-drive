import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './PrivateRoute';

// Components
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import StudentsList from './components/students/StudentsList';
import StudentForm from './components/students/StudentForm';
import StudentImport from './components/students/StudentImport';
import StudentDetails from './components/students/StudentDetails';
import DrivesList from './components/vaccination/DrivesList';
import DriveForm from './components/vaccination/DriveForm';
import DriveDetails from './components/vaccination/DriveDetails';
import RecordVaccination from './components/vaccination/RecordVaccination';
import VaccinationReport from './components/reports/VaccinationReport';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

function App() {
    return (
        <Router>
            <AuthProvider>
                <ToastContainer position="top-right" />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <Dashboard />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/students"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <StudentsList />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/students/add"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <StudentForm />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/students/import"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <StudentImport />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/students/:id"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <StudentDetails />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/students/:id/edit"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <StudentForm />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/drives"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <DrivesList />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/drives/add"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <DriveForm />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/drives/:id"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <DriveDetails />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/drives/:id/edit"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <DriveForm />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/vaccinate"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <RecordVaccination />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <PrivateRoute>
                                <div className="app-container">
                                    <Navbar />
                                    <div className="main-content">
                                        <Sidebar />
                                        <div className="content-wrapper">
                                            <VaccinationReport />
                                        </div>
                                    </div>
                                    <Footer />
                                </div>
                            </PrivateRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;