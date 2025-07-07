import React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../accordion';

// src/components/ui/accordion.test.tsx
import { render } from '@testing-library/react';
import "@testing-library/jest-dom";

// src/components/ui/accordion.test.tsx
// Mock cn utility
jest.mock("@/lib/utils", () => {
  const actual = jest.requireActual("@/lib/utils");
  return {
    ...actual,
    cn: jest.fn((...inputs: any[]) => inputs.filter(Boolean).join(' ')),
    __esModule: true,
  };
});

// Mock @radix-ui/react-accordion
jest.mock("@radix-ui/react-accordion", () => {
  const React = require('react');
  return {
    __esModule: true,
    Root: React.forwardRef((props: any, ref: any) => <div ref={ref} data-testid="accordion-root" {...props} />),
    Item: React.forwardRef((props: any, ref: any) => <div ref={ref} data-testid="accordion-item" {...props} />),
    Header: (props: any) => <div data-testid="accordion-header" {...props} />,
    Trigger: React.forwardRef((props: any, ref: any) => <button ref={ref} data-testid="accordion-trigger" {...props} />),
    Content: React.forwardRef((props: any, ref: any) => <div ref={ref} data-testid="accordion-content" {...props} />),
  };
});

// Mock lucide-react ChevronDown
jest.mock("lucide-react", () => ({
  __esModule: true,
  ChevronDown: (props: any) => <svg data-testid="chevron-down" {...props} />,
}));

describe('AccordionItem() AccordionItem method', () => {
  // Happy paths
  describe('Happy paths', () => {
    it('renders AccordionItem with default class and children', () => {
      // This test ensures AccordionItem renders with the default border-b class and children.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem>
            <span>Accordion Content</span>
          </AccordionItem>
        </Accordion>
      );
      const item = getByTestId('accordion-item');
      expect(item).toBeInTheDocument();
      expect(item).toHaveClass('border-b');
      expect(item).toHaveTextContent('Accordion Content');
    });

    it('applies custom className from props to AccordionItem', () => {
      // This test ensures that a custom className prop is merged with the default class.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem className="custom-class">
            <span>Accordion Content</span>
          </AccordionItem>
        </Accordion>
      );
      const item = getByTestId('accordion-item');
      expect(item).toHaveClass('border-b');
      expect(item).toHaveClass('custom-class');
    });

    it('renders AccordionItem with AccordionTrigger and AccordionContent as children', () => {
      // This test ensures AccordionItem can render AccordionTrigger and AccordionContent as children.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>Trigger</AccordionTrigger>
            <AccordionContent>Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      expect(getByTestId('accordion-item')).toBeInTheDocument();
      expect(getByTestId('accordion-trigger')).toBeInTheDocument();
      expect(getByTestId('accordion-content')).toBeInTheDocument();
    });

    it('AccordionTrigger renders children and ChevronDown icon', () => {
      // This test ensures AccordionTrigger renders its children and the ChevronDown icon.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem>
            <AccordionTrigger>My Trigger</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      );
      const trigger = getByTestId('accordion-trigger');
      expect(trigger).toHaveTextContent('My Trigger');
      expect(getByTestId('chevron-down')).toBeInTheDocument();
    });

    it('AccordionContent renders children inside a div with correct classes', () => {
      // This test ensures AccordionContent renders its children inside a div with the correct classes.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem>
            <AccordionContent>Panel Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const content = getByTestId('accordion-content');
      expect(content).toBeInTheDocument();
      expect(content).toHaveTextContent('Panel Content');
    });
  });

  // Edge cases
  describe('Edge cases', () => {
    it('renders AccordionItem with empty children', () => {
      // This test ensures AccordionItem can render with no children without error.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem />
        </Accordion>
      );
      const item = getByTestId('accordion-item');
      expect(item).toBeInTheDocument();
      expect(item).toBeEmptyDOMElement();
    });

    it('AccordionItem passes arbitrary props to the underlying primitive', () => {
      // This test ensures that arbitrary props (e.g., id, data attributes) are passed to the primitive.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem id="test-id" data-custom="custom">
            <span>Accordion Content</span>
          </AccordionItem>
        </Accordion>
      );
      const item = getByTestId('accordion-item');
      expect(item).toHaveAttribute('id', 'test-id');
      expect(item).toHaveAttribute('data-custom', 'custom');
    });

    it('AccordionItem merges multiple classNames correctly', () => {
      // This test ensures that multiple classNames are merged correctly by the cn utility.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem className="foo bar">
            <span>Accordion Content</span>
          </AccordionItem>
        </Accordion>
      );
      const item = getByTestId('accordion-item');
      expect(item).toHaveClass('border-b');
      expect(item).toHaveClass('foo');
      expect(item).toHaveClass('bar');
    });

    it('AccordionTrigger passes additional props to the primitive', () => {
      // This test ensures that additional props (e.g., aria-expanded) are passed to the primitive trigger.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem>
            <AccordionTrigger aria-expanded="true">Trigger</AccordionTrigger>
          </AccordionItem>
        </Accordion>
      );
      const trigger = getByTestId('accordion-trigger');
      expect(trigger).toHaveAttribute('aria-expanded', 'true');
    });

    it('AccordionContent passes additional props to the primitive', () => {
      // This test ensures that additional props (e.g., role) are passed to the primitive content.
      const { getByTestId } = render(
        <Accordion>
          <AccordionItem>
            <AccordionContent role="region">Panel Content</AccordionContent>
          </AccordionItem>
        </Accordion>
      );
      const content = getByTestId('accordion-content');
      expect(content).toHaveAttribute('role', 'region');
    });
  });
});