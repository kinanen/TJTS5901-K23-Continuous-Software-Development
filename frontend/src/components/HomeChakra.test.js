import React from "react";
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import HomeChakra from "./HomeChakra";


test("renders \"Fast and Furious\" / service's name ", () => {
    
    render(<HomeChakra />)
    const copyrights = screen.getByText('Fast-and-Furious')
    expect(copyrights).toBeDefined()

})
