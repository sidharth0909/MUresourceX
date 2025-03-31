import React, { useState, useCallback, useRef, useEffect } from "react";
import Navbar from "../components/Navbar";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import styled from "styled-components";
import { Line, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Delete, Edit } from "@mui/icons-material";
import { useMemo } from "react";
import { supabase, getResourcePath } from "../supabase";

Chart.register(...registerables);

// Styled Components
const Container = styled.div`
  background: radial-gradient(ellipse at bottom, #1a1a2e 0%, #000000 100%);
  min-height: 100vh;
  color: #fff;
  position: relative;
  overflow: hidden;
`;

const DashboardContainer = styled.div`
  position: relative;
  z-index: 1;
  padding: 4rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const ChartCard = styled.div`
  background:  ${({ theme }) => theme.cardBg};
  padding: 1.5rem;
  border-radius: 10px;
  backdrop-filter: blur(10px);
  color: ${({ theme }) => theme.text};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  min-height: 300px;

  @media (max-width: 768px) {
    min-height: 250px;
  }
`;

const UploadForm = styled.form`
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 3rem;
  backdrop-filter: blur(10px);
`;

const DataTable = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow-x: auto;
  backdrop-filter: blur(10px);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  th {
    background: rgba(0, 255, 136, 0.1);
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #00ff88;
  cursor: pointer;
  margin: 0 5px;
  transition: opacity 0.3s;
  &:hover {
    opacity: 0.7;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 10px;
  z-index: 1000;
  width: 90%;
  max-width: 500px;
`;

const SelectField = styled.select`
  padding: 12px;
  background: transparent;
  border: 1px solid #00ff88;
  border-radius: 4px;
  color: #fff;
  margin: 8px;
  width: 200px;
  appearance: none;

  option {
    background: #1a1a2e;
    color: #fff;
  }
`;

const FileInput = styled.input`
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid #00ff88;
  border-radius: 4px;
  color: #fff;
  margin: 8px;
`;

const UploadButton = styled.button`
  padding: 12px 24px;
  background: #00ff88;
  color: #1a1a2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
  transition: all 0.3s ease;

  &:hover {
    background: #00cc6a;
  }
`;

// Initial mock data
const initialResources = [
  {
    id: "1",
    branch: "Computer Engineering",
    semester: "3",
    subject: "DBMS",
    fileName: "database-guide.pdf",
    fileSize: "2.4 MB",
    uploadDate: "2024-03-15",
    uploadTime: "14:30",
  },
];

const particlesOptions = {
  particles: {
    number: { value: 20 },
    color: { value: "#00ff88" },
    opacity: { value: 0.7 },
    size: { value: 1 },
    links: {
      enable: true,
      distance: 150,
      color: "#00ff88",
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      outModes: "bounce",
      straight: false,
    },
  },
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: "push",
        particles: {
          quantity: 5,
        },
      },
    },
    modes: {
      push: {
        quantity: 3,
        groups: ["links"],
        distance: 200,
        size: 50,
        duration: 0.4,
      },
      repulse: {
        distance: 200,
        duration: 0.4,
      },
    },
  },
};

const subjectsData = {
  "Computer Engineering": {
    1: [
      "Mathematics-I",
      "Physics",
      "Chemistry",
      "Programming",
      "Communication Skills",
    ],
    2: [
      "Mathematics-II",
      "Data Structures",
      "Digital Logic",
      "OOP",
      "Discrete Math",
    ],
    3: [
      "Operating Systems",
      "DBMS",
      "Computer Networks",
      "Software Engineering",
      "Web Development",
    ],
    4: [
      "Machine Learning",
      "AI",
      "Computer Graphics",
      "Theory of Computation",
      "Cloud Computing",
    ],
    5: [
      "Big Data Analytics",
      "Cyber Security",
      "Embedded Systems",
      "Distributed Computing",
      "IoT",
    ],
    6: [
      "Blockchain",
      "Data Mining",
      "Wireless Networks",
      "Advanced Algorithms",
      "DevOps",
    ],
    7: [
      "Quantum Computing",
      "Deep Learning",
      "AR/VR",
      "Computational Linguistics",
      "Edge AI",
    ],
    8: [
      "Research Methods",
      "Industry Project",
      "Ethical Hacking",
      "Startup Engineering",
      "Robotics",
    ],
  },
  "Mechanical Engineering": {
    1: [
      "Mathematics-I",
      "Engineering Physics",
      "Engineering Chemistry",
      "Basic Electrical",
      "Workshop",
    ],
    2: [
      "Mathematics-II",
      "Mechanics",
      "Thermodynamics",
      "Engineering Graphics",
      "Material Science",
    ],
    3: [
      "Fluid Mechanics",
      "Machine Design",
      "Heat Transfer",
      "Manufacturing",
      "Engineering Drawing",
    ],
    4: [
      "Dynamics of Machines",
      "Control Systems",
      "CAD/CAM",
      "Power Plant Engineering",
      "Robotics",
    ],
    5: [
      "IC Engines",
      "Refrigeration & AC",
      "Automobile Engineering",
      "Finite Element Method",
      "Mechatronics",
    ],
    6: [
      "Industrial Engineering",
      "3D Printing",
      "Vibration Analysis",
      "Welding Tech",
      "Product Design",
    ],
    7: [
      "Automation & AI",
      "Turbomachinery",
      "Renewable Energy",
      "Advanced Manufacturing",
      "Smart Materials",
    ],
    8: [
      "Capstone Project",
      "Entrepreneurship",
      "Green Manufacturing",
      "Aerospace Engineering",
      "Nano Tech",
    ],
  },
  "Electrical Engineering": {
    1: [
      "Mathematics-I",
      "Basic Electrical Engineering",
      "Physics",
      "Chemistry",
      "Workshop",
    ],
    2: [
      "Mathematics-II",
      "Circuit Analysis",
      "Electronics",
      "Electromagnetic Theory",
      "Signals & Systems",
    ],
    3: [
      "Power Systems",
      "Control Systems",
      "Electrical Machines",
      "Analog Electronics",
      "Microprocessors",
    ],
    4: [
      "Digital Signal Processing",
      "Power Electronics",
      "Network Theory",
      "Instrumentation",
      "AI in Power",
    ],
    5: [
      "Electric Drives",
      "Renewable Energy Systems",
      "Embedded Systems",
      "High Voltage Engineering",
      "IoT",
    ],
    6: [
      "Smart Grids",
      "Electrical Vehicle Tech",
      "Wireless Power Transfer",
      "Robotics",
      "Power Management",
    ],
    7: [
      "Optoelectronics",
      "Advanced Control Systems",
      "AI in Electrical",
      "Industrial Automation",
      "Cybersecurity",
    ],
    8: [
      "Project",
      "Research",
      "Management & Economics",
      "Entrepreneurship",
      "Ethics in Engineering",
    ],
  },
  "Civil Engineering": {
    1: [
      "Mathematics-I",
      "Engineering Mechanics",
      "Physics",
      "Chemistry",
      "Drawing",
    ],
    2: [
      "Mathematics-II",
      "Strength of Materials",
      "Structural Analysis",
      "Surveying",
      "Hydraulics",
    ],
    3: [
      "Building Materials",
      "Concrete Technology",
      "Geotechnical Engineering",
      "Transportation",
      "Design of Structures",
    ],
    4: [
      "Environmental Engineering",
      "Water Resources",
      "Construction Management",
      "Earthquake Engineering",
      "Bridge Engineering",
    ],
    5: [
      "Smart Cities",
      "Infrastructure Planning",
      "Sustainable Construction",
      "Tunnel Engineering",
      "Traffic Engineering",
    ],
    6: [
      "GIS & Remote Sensing",
      "Pavement Design",
      "Advanced Concrete Structures",
      "Hydrology",
      "Rock Mechanics",
    ],
    7: [
      "Disaster Management",
      "Green Buildings",
      "Urban Planning",
      "Air Pollution Control",
      "Seismic Design",
    ],
    8: [
      "Final Year Project",
      "Internship",
      "Business in Civil Engineering",
      "Construction Automation",
      "Smart Materials",
    ],
  },
};

const AdminDashboard = () => {
  const [resources, setResources] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [branch, setBranch] = useState("Computer Engineering");
  const [semester, setSemester] = useState("1");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [editingResource, setEditingResource] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const lineOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        y: {
          ticks: { color: "#fff" },
          grid: { color: "rgba(255,255,255,0.1)" },
        },
      },
    }),
    []
  );

  const pieOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#fff",
            boxWidth: 15,
            padding: 20,
          },
        },
      },
    }),
    []
  );

  // Chart data states
  const [uploadTrends] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Uploads per Month",
        data: [12, 19, 3, 5, 2, 3],
        borderColor: "#00ff88",
        tension: 0.4,
      },
    ],
  });

  const [branchDistribution] = useState({
    labels: ["Computer", "Mechanical", "Electrical", "Civil"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#00ff88", "#1aff8c", "#33ff99", "#4dffa6"],
      },
    ],
  });

  // Metrics calculations
  const totalResources = resources.length;
  const computerResources = resources.filter(r => 
    r.metadata?.branch === 'Computer Engineering'
  ).length;

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const subjects = subjectsData[branch][semester] || [];

  useEffect(() => {
    const fetchResources = async () => {
      const { data, error } = await supabase.storage
        .from('books')
        .list('', { 
          limit: 100, 
          offset: 0, 
          sortBy: { column: 'name', order: 'asc' },
          getMetadata: true // Include metadata in response
        });

      if (!error) {
        setResources(data || []);
      }
    };
    fetchResources();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !branch || !semester || !subject) return;

    const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    setMessage("Please sign in first!");
    return;
  }


    const cleanBranch = branch.toLowerCase().replace(/\s+/g, '-');
    const cleanSemester = `semester-${semester}`;
    const cleanSubject = subject.toLowerCase().replace(/\s+/g, '-');
    const cleanFileName = file.name.toLowerCase().replace(/\s+/g, '-');

    const filePath = `${cleanBranch}/${cleanSemester}/${cleanSubject}/${cleanFileName}`;

    const { error } = await supabase.storage
      .from('books')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
        customMetadata: { // Changed from metadata to customMetadata
          branch: branch,
          semester: semester,
          subject: subject
        }
      });

    if (error) {
      setMessage(`Upload failed: ${error.message}`);
    } else {
      // Refresh resources with metadata
      const { data } = await supabase.storage
        .from('books')
        .list('', { 
          limit: 100,
          getMetadata: true // Include metadata in refresh
        });
      setResources(data || []);
      setMessage("File uploaded successfully!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (filePath) => { // Changed to use full path
    const { error } = await supabase.storage
      .from('books')
      .remove([filePath]);

    if (!error) {
      setResources(resources.filter(r => r.name !== filePath));
      setMessage("Resource deleted!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleEdit = (resource) => {
    setEditingResource(resource);
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingResource) return;
  
    const oldPath = editingResource.name;
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from('books')
      .download(oldPath);
  
    if (downloadError) {
      setMessage("Failed to download file for update.");
      return;
    }
  
    const newBranch = editingResource.metadata.customMetadata.branch;
    const newSemester = editingResource.metadata.customMetadata.semester;
    const newSubject = editingResource.metadata.customMetadata.subject;
  
    // Construct new path
    const cleanBranch = newBranch.toLowerCase().replace(/\s+/g, '-');
    const cleanSemester = `semester-${newSemester}`;
    const cleanSubject = newSubject.toLowerCase().replace(/\s+/g, '-');
    const fileName = oldPath.split('/').pop();
    const newPath = `${cleanBranch}/${cleanSemester}/${cleanSubject}/${fileName}`;
  
    // Upload to new path with new metadata
    const { error: uploadError } = await supabase.storage
      .from('books')
      .upload(newPath, fileBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileBlob.type,
        customMetadata: {
          branch: newBranch,
          semester: newSemester,
          subject: newSubject
        }
      });
  
    if (uploadError) {
      setMessage(`Update failed: ${uploadError.message}`);
      return;
    }
  
    // Delete old file
    const { error: deleteError } = await supabase.storage
      .from('books')
      .remove([oldPath]);
  
    if (deleteError) {
      setMessage(`Failed to delete old file: ${deleteError.message}`);
      return;
    }
  
    // Refresh resources
    const { data } = await supabase.storage
      .from('books')
      .list('', { getMetadata: true });
    setResources(data || []);
    setShowModal(false);
    setMessage("Resource updated successfully!");
  };


  return (
    <Container>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={particlesOptions}
        style={{ position: "absolute" }}
      />

      <Navbar />
      <DashboardContainer>
        <h2>Admin Dashboard</h2>
        {message && (
  <div style={{
    color: message.includes("successfully") ? "#00ff88" : "#ff4444",
    marginBottom: "1rem",
    padding: "1rem",
    background: "rgba(0, 0, 0, 0.3)",
    borderRadius: "8px",
    display: "inline-block"
  }}>
    {message}
  </div>
)}

        <MetricsGrid>
          <ChartCard>
            <h3>Upload Trends</h3>
            <div style={{ height: "calc(100% - 40px)", position: "relative" }}>
              <Line data={uploadTrends} options={lineOptions} redraw={false} />
            </div>
          </ChartCard>

          <ChartCard>
            <h3>Branch Distribution</h3>
            <div style={{ height: "calc(100% - 40px)", position: "relative" }}>
              <Pie
                data={branchDistribution}
                options={pieOptions}
                redraw={false}
              />
            </div>
          </ChartCard>

          <ChartCard>
            <h3>Quick Metrics</h3>
            <div style={{ padding: "1rem 0" }}>
              <p>Total Resources: {totalResources}</p>
              <p>Computer Engineering Resources: {computerResources}</p>
              <p>Recent Uploads: {recentUploads.length}</p>
            </div>
          </ChartCard>
        </MetricsGrid>

        <UploadForm onSubmit={handleUpload}>
          <h3>Upload New Resource</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <SelectField
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {Object.keys(subjectsData).map((branch) => (
                <option key={branch} value={branch}>
                  {branch}
                </option>
              ))}
            </SelectField>

            <SelectField
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  Semester {num}
                </option>
              ))}
            </SelectField>

            <SelectField
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </SelectField>

            <FileInput
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              required
            />
          </div>
          <UploadButton type="submit">Upload Resource</UploadButton>
        </UploadForm>

        <DataTable>
          <h3>All Resources</h3>
          <Table>
            <thead>
              <tr>
                <th>File Name</th>
                <th>Branch</th>
                <th>Semester</th>
                <th>Subject</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
    {resources.map((resource) => (
      <tr key={resource.name}>
        <td>{resource.name.split('/').pop()}</td> {/* Display filename only */}
        <td>{resource.metadata?.customMetadata?.branch}</td>
        <td>Semester {resource.metadata?.customMetadata?.semester}</td>
        <td>{resource.metadata?.customMetadata?.subject}</td>
        <td>
        {new Date(resource.created_at).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </td>
        <td>
          <ActionButton onClick={() => handleEdit(resource)}>
            <Edit />
          </ActionButton>
          <ActionButton onClick={() => handleDelete(resource.name)}>
            <Delete />
          </ActionButton>
        </td>
      </tr>
    ))}
  </tbody>
          </Table>
        </DataTable>

        {showModal && editingResource && (
          <Modal>
            <h3>Edit Resource</h3>
            <form onSubmit={handleUpdate}>
              <label>
                Branch:
                <select
                  value={editingResource.metadata?.customMetadata?.branch || ''}
                  onChange={(e) =>
                    setEditingResource({
                      ...editingResource,
                      metadata: {
                        ...editingResource.metadata,
                        customMetadata: {
                          ...editingResource.metadata.customMetadata,
                          branch: e.target.value,
                        },
                      },
                    })
                  }
                >        
                  {Object.keys(subjectsData).map((branch) => (
            <option key={branch} value={branch}>
              {branch}
            </option>
          ))}
        </select>
      </label>

      <label>
        Semester:
        <select
          value={editingResource.metadata?.customMetadata?.semester || ''}
          onChange={(e) =>
            setEditingResource({
              ...editingResource,
              metadata: {
                ...editingResource.metadata,
                customMetadata: {
                  ...editingResource.metadata.customMetadata,
                  semester: e.target.value,
                },
              },
            })
          }
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>
              Semester {num}
            </option>
          ))}
        </select>
      </label>

      <label>
        Subject:
        <select
          value={editingResource.metadata?.customMetadata?.subject || ''}
          onChange={(e) =>
            setEditingResource({
              ...editingResource,
              metadata: {
                ...editingResource.metadata,
                customMetadata: {
                  ...editingResource.metadata.customMetadata,
                  subject: e.target.value,
                },
              },
            })
          }
        >
          {subjectsData[editingResource.metadata?.customMetadata?.branch]?.[
            editingResource.metadata?.customMetadata?.semester
          ]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </label>

              <div>
                <UploadButton type="submit">Save Changes</UploadButton>
                <ActionButton type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </ActionButton>
              </div>
            </form>
          </Modal>
        )}
      </DashboardContainer>
    </Container>
  );
};

export default AdminDashboard;
