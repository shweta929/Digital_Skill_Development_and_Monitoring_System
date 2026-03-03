import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../PROJECT_styles.css";

const EducationDetails = () => {
    const navigate = useNavigate();

    const [eduData, setEduData] = useState({
        // 10th
        tenthBoard: "",
        tenthYear: "",
        tenthPercentage: "",

        // 12th
        twelfthBoard: "",
        twelfthYear: "",
        twelfthPercentage: "",

        // Graduation
        collegeName: "",
        degree: "",
        graduationStream: "",
        graduationYear: "",
        graduationPercentage: "",
    });

    const handleChange = (e) => {
        setEduData({ ...eduData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const studentId = localStorage.getItem("studentId");
        console.log("📤 studentId being sent:", studentId);


        if (!studentId) {
            alert("Please register first ❌");
            navigate("/register");
            return;
        }


        try {
            const res = await fetch("/api/students/education", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    student_id: studentId,

                    tenthBoard: eduData.tenthBoard,
                    tenthYear: eduData.tenthYear,
                    tenthPercentage: eduData.tenthPercentage,

                    twelfthBoard: eduData.twelfthBoard,
                    twelfthYear: eduData.twelfthYear,
                    twelfthPercentage: eduData.twelfthPercentage,

                    collegeName: eduData.collegeName,
                    degree: eduData.degree,
                    graduationStream: eduData.graduationStream,
                    graduationYear: eduData.graduationYear,
                    graduationPercentage: eduData.graduationPercentage,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Education details not saved ❌");
                return;
            }

            // ✅ STEP 5: CLEANUP
            localStorage.removeItem("studentId");

            alert("Education details saved ✅");
            navigate("/welcome");

        } catch (error) {
            console.log(error);
            alert("Server error ❌");
        }
    };

    return (
        <div className="auth-page">
            <BackButton />
            <div className="auth-logo">
                <img src="/logo.png" alt="Career Credentials" />
            </div>

            <div className="auth-container" style={{ maxWidth: "800px" }}>
                <div className="colorful-card auth-card">
                    <h3 className="text-center">Educational Details</h3>
                    <p className="subtitle">Let's build your academic profile</p>

                    <form className="register-grid" onSubmit={handleSubmit}>
                        {/* 10th */}
                        <div className="full-width">
                            <h5 style={{ marginBottom: "15px", borderBottom: '1px solid #edf2f7', paddingBottom: '8px', color: '#4a5568' }}>10th Standard</h5>
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Board Name</label>
                            <input
                                className="form-control"
                                placeholder="SSC / CBSE"
                                name="tenthBoard"
                                value={eduData.tenthBoard}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Passing Year</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 2020"
                                name="tenthYear"
                                value={eduData.tenthYear}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper full-width">
                            <label className="form-label">Percentage (%)</label>
                            <input
                                className="form-control"
                                placeholder="e.g. 85"
                                name="tenthPercentage"
                                value={eduData.tenthPercentage}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 12th */}
                        <div className="full-width">
                            <h5 style={{ marginBottom: "15px", marginTop: "10px", borderBottom: '1px solid #edf2f7', paddingBottom: '8px', color: '#4a5568' }}>12th Standard / Diploma</h5>
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Board Name</label>
                            <input
                                className="form-control"
                                placeholder="HSC / CBSE"
                                name="twelfthBoard"
                                value={eduData.twelfthBoard}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Passing Year</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 2022"
                                name="twelfthYear"
                                value={eduData.twelfthYear}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper full-width">
                            <label className="form-label">Percentage (%)</label>
                            <input
                                className="form-control"
                                placeholder="e.g. 78"
                                name="twelfthPercentage"
                                value={eduData.twelfthPercentage}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Graduation */}
                        <div className="full-width">
                            <h5 style={{ marginBottom: "15px", marginTop: "10px", borderBottom: '1px solid #edf2f7', paddingBottom: '8px', color: '#4a5568' }}>Graduation Details</h5>
                        </div>

                        <div className="input-wrapper full-width">
                            <label className="form-label">College / University Name</label>
                            <input
                                className="form-control"
                                placeholder="Enter college name"
                                name="collegeName"
                                value={eduData.collegeName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Degree</label>
                            <input
                                className="form-control"
                                placeholder="BE / BCA / BSc"
                                name="degree"
                                value={eduData.degree}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Stream</label>
                            <input
                                className="form-control"
                                placeholder="IT / CS / ENTC"
                                name="graduationStream"
                                value={eduData.graduationStream}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Passing Year</label>
                            <input
                                type="number"
                                className="form-control"
                                placeholder="e.g. 2025"
                                name="graduationYear"
                                value={eduData.graduationYear}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-wrapper">
                            <label className="form-label">Percentage / CGPA</label>
                            <input
                                className="form-control"
                                placeholder="e.g. 8.2 or 75%"
                                name="graduationPercentage"
                                value={eduData.graduationPercentage}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="full-width mt-4">
                            <button type="submit" className="btn-primary w-100">
                                Save & Continue
                            </button>
                        </div>
                    </form>

                    <p className="auth-footer-text">
                        <Link to="/welcome">Skip for now</Link>
                    </p>
                </div>
                <p className="auth-footer">© 2025 Career Credentials</p>
            </div>
        </div>
    );
};

export default EducationDetails;
