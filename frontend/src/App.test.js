import React from "react";
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders \"Fast and Furious\" / service's name ", () => {
        
        render(<App />)
        const faf = screen.getByText('fast-and-furious')
        expect(copyrights).toBeDefined()
    
    })