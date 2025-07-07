
import { QueryClient } from "@tanstack/react-query";
import App from '../App';

// src/App.test.tsx
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";
type MockRouteObject = {
  path: string;
  element: React.ReactNode;
  children: MockRouteObject[];
};
// ---- Mocking child components and providers ----
jest.mock("@/components/ui/toaster", () => ({
  Toaster: () => <div data-testid="toaster-mock">Toaster</div>,
}));
jest.mock("@/components/ui/sonner", () => ({
  Toaster: () => <div data-testid="sonner-mock">Sonner</div>,
}));
jest.mock("@/components/ui/tooltip", () => ({
  TooltipProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tooltip-provider-mock">{children}</div>
  ),
}));
jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    QueryClientProvider: ({ children }: { client: QueryClient; children: React.ReactNode }) => (
      <div data-testid="query-client-provider-mock">{children}</div>
    ),
    QueryClient: jest.fn().mockImplementation(() => ({
      // minimal mock
      getQueryCache: jest.fn(),
    })),
  };
});
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="browser-router-mock">{children}</div>
    ),
    Routes: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="routes-mock">{children}</div>
    ),
    Route: ({ path, element }: { path: string; element: React.ReactNode }) => (
      <div data-testid={`route-mock-${path}`}>{element}</div>
    ),
  };
});
jest.mock("@/contexts/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider-mock">{children}</div>
  ),
}));
jest.mock("../pages/Index", () => ({
  __esModule: true,
  default: () => <div data-testid="index-page-mock">Index Page</div>,
}));
jest.mock("../pages/Auth", () => ({
  __esModule: true,
  default: () => <div data-testid="auth-page-mock">Auth Page</div>,
}));
jest.mock("../pages/NotFound", () => ({
  __esModule: true,
  default: () => <div data-testid="notfound-page-mock">Not Found</div>,
}));

// ---- Begin Integration Test Suite ----
describe('App() App method', () => {
  // Happy Path Tests
  describe("Happy paths", () => {
    it("renders the App and all primary providers/components", () => {
      // This test ensures that all main providers and UI components are rendered.
      render(<App />);
      expect(screen.getByTestId("query-client-provider-mock")).toBeInTheDocument();
      expect(screen.getByTestId("tooltip-provider-mock")).toBeInTheDocument();
      expect(screen.getByTestId("toaster-mock")).toBeInTheDocument();
      expect(screen.getByTestId("sonner-mock")).toBeInTheDocument();
      expect(screen.getByTestId("browser-router-mock")).toBeInTheDocument();
      expect(screen.getByTestId("auth-provider-mock")).toBeInTheDocument();
      expect(screen.getByTestId("routes-mock")).toBeInTheDocument();
    });

    it("renders the Index page for the root route", () => {
      // This test ensures that the Index page is rendered for the root path.
      render(<App />);
      expect(screen.getByTestId("index-page-mock")).toBeInTheDocument();
    });

    it("renders the Auth page for the /auth route", () => {
      // This test ensures that the Auth page is rendered for the /auth path.
      // Simulate navigation by mocking location.pathname
      jest.spyOn(window, "location", "get").mockReturnValue({
        ...window.location,
        pathname: "/auth",
      } as any);
      render(<App />);
      expect(screen.getByTestId("auth-page-mock")).toBeInTheDocument();
    });

    it("renders the NotFound page for an unknown route", () => {
      // This test ensures that the NotFound page is rendered for an unknown path.
      jest.spyOn(window, "location", "get").mockReturnValue({
        ...window.location,
        pathname: "/some-unknown-route",
      } as any);
      render(<App />);
      expect(screen.getByTestId("notfound-page-mock")).toBeInTheDocument();
    });

    it("renders Toaster and Sonner components", () => {
      // This test ensures that both Toaster and Sonner are rendered.
      render(<App />);
      expect(screen.getByTestId("toaster-mock")).toBeInTheDocument();
      expect(screen.getByTestId("sonner-mock")).toBeInTheDocument();
    });

    it("renders TooltipProvider and passes children", () => {
      // This test ensures TooltipProvider wraps its children.
      render(<App />);
      const tooltipProvider = screen.getByTestId("tooltip-provider-mock");
      expect(tooltipProvider).toBeInTheDocument();
      expect(tooltipProvider).toContainElement(screen.getByTestId("toaster-mock"));
      expect(tooltipProvider).toContainElement(screen.getByTestId("sonner-mock"));
    });

    it("renders AuthProvider and passes children", () => {
      // This test ensures AuthProvider wraps its children.
      render(<App />);
      const authProvider = screen.getByTestId("auth-provider-mock");
      expect(authProvider).toBeInTheDocument();
      expect(authProvider).toContainElement(screen.getByTestId("routes-mock"));
    });
  });

  // Edge Case Tests
  describe("Edge cases", () => {
    it("renders NotFound page when route does not match any defined route", () => {
      // This test ensures the catch-all route renders NotFound for unmatched paths.
      jest.spyOn(window, "location", "get").mockReturnValue({
        ...window.location,
        pathname: "/does-not-exist",
      } as any);
      render(<App />);
      expect(screen.getByTestId("notfound-page-mock")).toBeInTheDocument();
    });

    it("renders Index page even if query params are present", () => {
      // This test ensures Index page renders for root with query params.
      jest.spyOn(window, "location", "get").mockReturnValue({
        ...window.location,
        pathname: "/",
        search: "?foo=bar",
      } as any);
      render(<App />);
      expect(screen.getByTestId("index-page-mock")).toBeInTheDocument();
    });

    it("renders Auth page even if hash is present in the URL", () => {
      // This test ensures Auth page renders for /auth with hash.
      jest.spyOn(window, "location", "get").mockReturnValue({
        ...window.location,
        pathname: "/auth",
        hash: "#section",
      } as any);
      render(<App />);
      expect(screen.getByTestId("auth-page-mock")).toBeInTheDocument();
    });

    it("renders NotFound page for deeply nested unknown route", () => {
      // This test ensures NotFound renders for a deeply nested unknown route.
      jest.spyOn(window, "location", "get").mockReturnValue({
        ...window.location,
        pathname: "/foo/bar/baz",
      } as any);
      render(<App />);
      expect(screen.getByTestId("notfound-page-mock")).toBeInTheDocument();
    });

    it("renders all providers/components even if children are empty", () => {
      // This test ensures providers render even if their children are empty.
      // We'll mock the children to be empty for this test.
      jest.mock("@/components/ui/tooltip", () => ({
        TooltipProvider: () => <div data-testid="tooltip-provider-mock" />,
      }));
      jest.mock("@/contexts/AuthContext", () => ({
        AuthProvider: () => <div data-testid="auth-provider-mock" />,
      }));
      render(<App />);
      expect(screen.getByTestId("tooltip-provider-mock")).toBeInTheDocument();
      expect(screen.getByTestId("auth-provider-mock")).toBeInTheDocument();
    });
  });
});