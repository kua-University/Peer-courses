import { render, screen } from "@testing-library/react";
import Home from "../../app/page";
import Navbar from "../../components/navbar";
import AddCourse from "../../components/addcourse";

jest.mock("@/components/navbar", () => () => <div data-testid="navbar">Mock Navbar</div>);
jest.mock("@/components/addcourse", () => () => <div data-testid="add-course">Mock AddCourse</div>);


describe("Home Component", () => {
    test("renders Navbar and AddCourse components", () => {
        render(<Home />);

        expect(screen.getByTestId("navbar")).toBeInTheDocument();
        expect(screen.getByTestId("add-course")).toBeInTheDocument();
    });
});
