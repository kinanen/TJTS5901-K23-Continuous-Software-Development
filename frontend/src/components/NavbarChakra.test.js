import React from "react";
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import NavbarChakra from "./NavbarChakra";
import { initReactI18next } from "react-i18next";
import axios from "axios";


test ("render navbar items", () => {
    render(<NavbarChakra />)
    const signedInActions = screen.getByText('signed-in-actions')
    const viewItems = screen.getByText('view-items')
    const home = screen.getByText('home')
    const navItems = [signedInActions, viewItems, home]
    expect(navItems).toBeDefined()
})
