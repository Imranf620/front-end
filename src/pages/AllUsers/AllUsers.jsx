import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { getAllUsers } from '../../features/adminSlice';
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, TablePagination } from '@mui/material';
import { Link } from 'react-router-dom';
import { invertStatus } from '../../features/filesSlice';

const AllUsers = () => {
    const [loading, setLoading] = useState(true);
    const [AllUsers, setAllUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const result = await dispatch(getAllUsers());
                setAllUsers(result.payload.data.users);
                if (result.payload.success === false) {
                    toast.error(result.payload.message);
                }
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        fetchAllUsers();
    }, [dispatch]);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const toggleStatus = async (userId) => {
        const res = await dispatch(invertStatus(userId));
        if (res.payload.success === true) {
            toast.success(res.payload.message);
            setAllUsers(prevUsers =>
                prevUsers.map(user =>
                    user.id === userId ? { ...user, active: !user.active } : user
                )
            );
        } else {
            toast.error(res.payload.message);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const filteredUsers = AllUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const calculateRemainingDays = (subscribedAt, validDays) => {
        const subscriptionDate = new Date(subscribedAt);
        const expirationDate = new Date(subscriptionDate.setDate(subscriptionDate.getDate() + validDays));
        const today = new Date();
        const diffTime = expirationDate - today;
        const remainingDays = Math.ceil(diffTime / (1000 * 3600 * 24));
        return remainingDays;
    };

    const calculateStorageUsage = (files) => {
        if (!files || files.length === 0) {
            return "0.00";
        }
  
        const totalSize = files.reduce((total, file) => total + (file.size || 0), 0);
        const totalSizeInGB = totalSize / (1024 * 1024 * 1024);
  
        return totalSizeInGB.toFixed(2);
    };

    if (loading) return <Loader />;

    return (
        <div className="p-5">
            <div className="mb-4 flex justify-between items-center">
                <TextField
                    label="Search Users"
                    variant="outlined"
                    value={search}
                    onChange={handleSearch}
                    className="w-1/3"
                />
            </div>

            <TableContainer className="shadow-lg rounded-lg overflow-hidden">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Files</TableCell>
                            <TableCell>Subscription</TableCell>
                            <TableCell>Storage</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => {
                            const remainingDays = calculateRemainingDays(user.subscribedAt, user.validDays)>0 ? calculateRemainingDays(user.subscribedAt, user.validDays):0
                            const storageUsed = calculateStorageUsage(user.files);
                            const totalStorage = user.totalStorage;
                            return (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.files.length}</TableCell>

                                    <TableCell>{remainingDays} days remaining</TableCell>
                                    <TableCell>{storageUsed} GB used / {totalStorage} GB</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color={user.active ? 'success' : 'error'}
                                            onClick={() => toggleStatus(user.id)}
                                        >
                                            {user.active ? 'Active' : 'Inactive'}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Link to={`/admin/user/${user.id}`}>
                                            <Button variant="outlined">View</Button>
                                        </Link>
                                        
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={filteredUsers.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
};

export default AllUsers;
