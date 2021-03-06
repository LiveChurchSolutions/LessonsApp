import Link from "next/link";
import { useRouter } from "next/router"
import { UserHelper, Permissions, ApiHelper } from "@/utils";
import { ClickAwayListener, Container, Icon, Menu, MenuItem, AppBar, Stack, Box, Button } from "@mui/material";
import { useState } from "react";

export function Header() {
  const router = useRouter()
  const [menuAnchor, setMenuAnchor] = useState<any>(null);

  const adminItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit) && (
    <MenuItem onClick={() => { router.push("/admin") }} ><Icon sx={{marginRight: "5px"}}>admin_panel_settings</Icon> Admin</MenuItem>
  );

  const cpItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules) && (
    <MenuItem onClick={() => { router.push("/cp") }} ><Icon sx={{marginRight: "5px"}}>calendar_month</Icon> Schedules</MenuItem>
  );

  function logout() {
    router.push("/logout")
  }

  const userAction = ApiHelper.isAuthenticated ? (
    <>
      <ClickAwayListener onClickAway={() => setMenuAnchor(null)}>
        <a id="userMenuLink" href="about:blank" onClick={(e) => { e.preventDefault(); setMenuAnchor((Boolean(menuAnchor)) ? null : e.target); }}>{`${UserHelper.user.firstName} ${UserHelper.user.lastName}`}<Icon style={{ paddingTop: 6 }}>expand_more</Icon></a>
      </ClickAwayListener>
      <Menu id="userMenu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "userMenuLink" }} style={{ top: "0", width: "min-content" }} >
        {adminItems}
        {cpItems}
        <MenuItem onClick={() => { logout(); }} ><Icon sx={{marginRight: "5px"}}>logout</Icon> Logout</MenuItem>
      </Menu>
    </>
  ) : (
    <Link href="/login">
      <a>Login</a>
    </Link>
  );

  return (
    <div>
      <AppBar id="navbar" position="fixed">
        <Container>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Link href="/">
              <a className="logo"><img src="/images/logo.png" alt="Lessons.church - Free Curriculum for Churches" /></a>
            </Link>
            <Box sx={{display: "flex", alignItems: "center", whiteSpace: "nowrap"}}>{userAction}</Box>
          </Stack>
        </Container>
      </AppBar>
      <div id="navSpacer" />
    </div>
  );
}
