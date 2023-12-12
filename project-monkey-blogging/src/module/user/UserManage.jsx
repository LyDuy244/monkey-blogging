import DashboardHeading from "../dashboard/DashboardHeading";
import React from "react";
import { Button } from "../../components/button";
import UserTable from "./UserTable";
import { useAuthContext } from "../../context/auth-context";
import { userRole } from "../../utils/constans";

const UserManage = () => {


  
  const {userInfo} = useAuthContext();
  if(userInfo.role !== userRole.ADMIN) return;

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      >
        <Button type='button' kind='ghost' to='manage/add-user'>Add new user</Button>
      </DashboardHeading>
      <UserTable></UserTable>
    </div>
  );
};

export default UserManage;