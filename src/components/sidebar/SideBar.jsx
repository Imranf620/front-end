import React from 'react';
import { List, ListItem, ListItemText, Divider, ListItemIcon } from '@mui/material';
import { Folder, Image, Description, Movie, FileCopy, Dashboard } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import ShareIcon from '@mui/icons-material/Share';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { useSelector } from 'react-redux';
import GroupIcon from '@mui/icons-material/Group';

const SideBar = ({handleToggle}) => {
  const { isDarkMode } = useTheme();

  const { user } = useSelector((state) => state.auth);
  console.log(user?.user)
  const location = useLocation();

  const sidebarItems = user?.user?.role==="USER" ? [
    { path: '/', label: 'Dashboard', icon: <Dashboard style={{ color: 'white' }} /> },
    { path: '/dashboard/files', label: 'Files', icon: <Folder style={{ color: 'white' }} /> },
    { path: '/dashboard/images', label: 'Images', icon: <Image style={{ color: 'white' }} /> },
    { path: '/dashboard/documents', label: 'Documents', icon: <Description style={{ color: 'white' }} /> },
    { path: '/dashboard/media', label: 'Media', icon: <Movie style={{ color: 'white' }} /> },
    { path: '/dashboard/other', label: 'Other', icon: <FileCopy style={{ color: 'white' }} /> },
    { path: '/dashboard/all/shared', label: 'Shared', icon: <ShareIcon style={{ color: 'white' }} /> },
    { path: '/dashboard/all/accessible', label: 'Accessible', icon: <AccessibilityNewIcon style={{ color: 'white' }} /> },
    { path: '/dashboard/bin/all', label: 'Trash', icon: <DeleteIcon style={{ color: 'white' }} /> },

  ]:[
    { path: '/admin/users', label: 'Users', icon: <GroupIcon style={{ color: 'white' }} /> },
    { path: '/admin/files', label: ' Files', icon: <Folder style={{ color: 'white' }} /> },
  
  ]

  const getLinkClass = (path) => {
    return location.pathname === path ? 'bg-[#681c75]' : '';
  };

  return (
    <div
      className={`w-64 fixed h-screen text-white ${isDarkMode ? 'bg-[#303030]' : 'bg-[#9C27B0]'}`}
    >
      <List>
        {sidebarItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem onClick={handleToggle}  component={Link} to={`${item.path}`} className={getLinkClass(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
            {index < sidebarItems.length - 1 && <Divider />} 
          </React.Fragment>
        ))}
      </List>
    </div>
  );
};

export default SideBar;
