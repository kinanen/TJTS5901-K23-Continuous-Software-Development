import React from "react";
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import FooterChakra from "./FooterChakra";


test("renders content", () => {
    
    render(<FooterChakra />);
    const copyrights = screen.getByText('copyrights')
    expect(copyrights).toBeDefined()

})

test ("renders logo", () => {
    render(<FooterChakra />);
    const logo = screen.getByAltText('FF Logo')
    expect(logo).toBeDefined()
})