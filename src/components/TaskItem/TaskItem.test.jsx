import { it, describe, expect } from "vitest";
import { render, screen } from '@testing-library/react';
import TaskItem from './TaskItem';

describe("TaskItem", () => {
    it("Renders Task Item", () => {
        render(<TaskItem task={{ id: 1, title: "Task 1", completed: false }} />);
        expect(screen.getByText('Task 1')).toBeInTheDocument()
    })
})