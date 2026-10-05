import { Children, cloneElement, isValidElement } from "react";
import Animated from "./Animated";

/**
 * Stagger
 * Wraps a set of children and applies an incremental delay to each.
 * Children must be <Animated> elements (or accept a delay prop).
 *
 * @param {number} delay     Base delay before the first child
 * @param {number} stagger   Delay added between each child
 * @param {string} variant   Passed through to Animated if the child is a plain node
 */
export default function Stagger({ children, delay = 0, stagger = 90, variant = "up" }) {
  const items = Children.toArray(children);

  return (
    <>
      {items.map((child, i) => {
        const childDelay = delay + i * stagger;

        // If the child is already an Animated element, inject delay
        if (isValidElement(child) && child.type === Animated) {
          return cloneElement(child, {
            key: child.key ?? i,
            delay: child.props.delay ?? childDelay,
          });
        }

        // Otherwise wrap it in Animated
        return (
          <Animated key={i} variant={variant} delay={childDelay}>
            {child}
          </Animated>
        );
      })}
    </>
  );
}