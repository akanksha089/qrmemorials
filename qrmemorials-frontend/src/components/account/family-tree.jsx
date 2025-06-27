import  { useState , useEffect} from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function familyTree({ packageId, token, activeTab, API_BASE_URL }) {
    const [members, setMembers] = useState([{ relation: "", name: "", sortNumber: "" }]);
    const [isEditMode, setIsEditMode] = useState(false);

    const handleChange = (index, field, value) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    };


    const addMember = () => {
        setMembers([...members, { relation: "", name: "", sortNumber: "" }]);
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            const updated = members.filter((_, i) => i !== index);
            setMembers(updated);
        }
    };

    const handleFamilySubmit = async () => {
        if (!packageId || members.length === 0) {
            toast.error("Please enter package ID and at least one member.");
            return;
        }

        const cleanedMembers = members
            .filter((m) => m.name && m.relation)
            .map((m) => ({
                name: m.name,
                relation: m.relation,
                sortNumber: parseInt(m.sortNumber) || 0,
            }));

        try {
            const url = `${API_BASE_URL}/api/v1/packages/family${isEditMode ? `/${packageId}` : ""}`;
            const method = isEditMode ? "put" : "post";

            const res = await axios({
                method,
                url,
                data: {
                    package_id: packageId,
                    members: cleanedMembers,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (res.data.success) {
                toast.success(`Family members ${isEditMode ? "updated" : "created"} successfully`);
            } else {
                toast.error(res.data.message || "Operation failed.");
            }
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong while submitting.");
        }
    };
  const loadFamilyMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/packages/family/${packageId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        const fetched = res.data.members.map((m) => ({
          name: m.name,
          relation: m.relation,
          sortNumber: m.sort_number || "",
        }));
        setMembers(fetched);
        setIsEditMode(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load family members");
    }
  };
    useEffect(() => {
    if (packageId && activeTab === "Family Tree") {
      loadFamilyMembers();
    }
  }, [packageId, activeTab]);
    return (
        <div className="w-full   dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
            <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6 ">Family Tree
            </h4>
            <div className="space-y-6">
                {members.map((member, index) => (
                    <div
                        key={index}
                        className="grid gap-5 sm:gap-6 w-full col-span-1 lg:grid-cols-10 items-end"
                    >
                        <div className="col-span-4">
                            <select
                                className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                value={member.relation}
                                onChange={(e) => handleChange(index, 'relation', e.target.value)}
                            >
                                <option value="" disabled>Select Relation</option>
                                <option value="Parent">Parent</option>
                                <option value="Mother">Mother</option>
                                <option value="Father">Father</option>
                                <option value="Brother">Brother</option>
                                <option value="Sister">Sister</option>
                                <option value="Son">Son</option>
                                <option value="Daughter">Daughter</option>
                                <option value="Husband">Husband</option>
                                <option value="Wife">Wife</option>
                                <option value="Grandfather">Grandfather</option>
                                <option value="Grandmother">Grandmother</option>
                                <option value="Grandson">Grandson</option>
                                <option value="Granddaughter">Granddaughter</option>
                                <option value="Step-Father">Step-Father</option>
                                <option value="Step-Mother">Step-Mother</option>
                                <option value="Step-sibling">Step-sibling</option>
                                <option value="Step-child">Step-child</option>
                                <option value="Uncle">Uncle</option>
                                <option value="Aunt">Aunt</option>
                                <option value="Male Cousin">Male Cousin</option>
                                <option value="Female Cousin">Female Cousin</option>
                                <option value="Nephew">Nephew</option>
                                <option value="Niece">Niece</option>
                                <option value="Mother-in-Law">Mother-in-Law</option>
                                <option value="Father-in-Law">Father-in-Law</option>
                                <option value="Brother-in-Law">Brother-in-Law</option>
                                <option value="Sister-in-Law">Sister-in-Law</option>
                                <option value="Son-in-Law">Son-in-Law</option>
                                <option value="Daughter-in-Law">Daughter-in-Law</option>
                            </select>
                        </div>
                        <div className="col-span-4">
                            <input
                                className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 appearance-none"
                                type="text"
                                placeholder="Name*"
                                value={member.name}
                                onChange={(e) => handleChange(index, 'name', e.target.value)}
                            />
                        </div>
                        <div className="col-span-2 flex gap-2">
                            <input
                                className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 appearance-none"
                                type="text"
                                placeholder="Sort Number"
                                value={member.sortNumber}
                                onChange={(e) => handleChange(index, 'sortNumber', e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => removeMember(index)}
                                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
                                title="Remove"
                            >
                                −
                            </button>
                        </div>
                    </div>
                ))}
                <div>
                    <button
                        type="button"
                        onClick={addMember}
                        className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark"
                    >
                        + Add Family Member
                    </button>
                </div>
            </div>


            <div className="mt-5 sm:mt-8 md:mt-12">
                <button onClick={handleFamilySubmit}  className="btn btn-solid" data-text="Submit">
                    <span>Submit</span>
                </button>
            </div>
        </div>
    )
}

export default familyTree