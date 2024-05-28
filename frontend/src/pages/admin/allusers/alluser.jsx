import axios from "axios";
import baseUrl from "../../../core";
import { useEffect, useRef, useState } from "react";




const Allusers = () => {
    const [user, setUsers] = useState([])
    const [selectedUser, setSelectedUser] = useState(false);
    let statusSelection = useRef(null)


    const handleDelete = async (userId) => {
        try {
            const response = await axios.delete(`${baseUrl}/api/v1/delete-user/${userId}`, { withCredentials: true });
            fetchUsers()
        } catch (error) {
            console.log(error);
        }
        console.log('Deleting user with ID:', userId);
    };

    const handleEdit = async (userId) => {
        // Add your edit logic here
        try {
            const response = await axios.put(`${baseUrl}/api/v1/update-user/${userId}`, {
                status: statusSelection.current.value
            });
            console.log(response);
            fetchUsers()
        } catch (error) {
            console.log(error);
        }
        setSelectedUser(null)
        console.log("selected", statusSelection.current.value);
        console.log('Editing user:', userId);
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/allusers`, { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    return (
        <>


            <div className="w-4/5 absolute right-0 flex justify-center min-h-screen">
                <div className="overflow-x-auto w-full">
                    <div className="min-w-full inline-block">
                        <table className="divide-y divide-gray-200 rounded-lg overflow-hidden min-w-full">
                            <thead className="bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                <tr>
                                    <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium">
                                        Full Name
                                    </th>
                                    <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium">
                                        Email
                                    </th>
                                    <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium">
                                        Status
                                    </th>
                                    <th scope="col" className="px-2 sm:px-6 py-3 text-left text-xs font-medium">
                                        Profile Image
                                    </th>
                                    <th scope="col" className="px-2 sm:px-6 py-3">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {user.map((user) => (
                                    <tr key={user._id}>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{user.fullName}</td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                                            {user.isAdmin === "true" ? "Admin" : "User"}
                                            {selectedUser && selectedUser._id === user._id ?
                                                <> <select ref={statusSelection} name="" id="">
                                                    <option disabled selected>select</option>
                                                    <option value={true}>isAdmin</option>
                                                    <option value={false}>User</option>
                                                </select> </>
                                                : null
                                            } </td>

                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap">
                                            <img src={user.profileAvatar} alt={user.fullName} className="h-10 w-10 rounded-full" />
                                        </td>
                                        <td className="px-2 sm:px-6 py-4 whitespace-nowrap text-right text-sm">
                                            {selectedUser && selectedUser._id === user._id ?
                                                <button
                                                    onClick={() => handleEdit(user._id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-2 border border-black"
                                                >save</button>
                                                :
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-2"
                                                >Edit </button>
                                            }

                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        </>
    );
}

export default Allusers;