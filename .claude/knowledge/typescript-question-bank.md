# TypeScript Interview Question Bank

Source: https://www.geeksforgeeks.org/typescript/typescript-interview-questions/
(fetched 2026-08-26). Every question below is covered in `src/data/typescript.ts`.
Answers in the app are written from scratch and modernised (TS 5.x) — the list is the
coverage checklist, not a transcription.

## Question list

- 1. Explain the data types available in TypeScript.
- 2. In how many ways we can declare variables in TypeScript?
- 3. How you can declare a explicit variables in Typescript?
- 4. How to declare a function with typed annotation in TypeScript?
- 5. Describe the "any" type in TypeScript.
- 6. What are the advantages of using TypeScript?
- 7. List some disadvantages of using TypeScript.
- 8. Explain the void type in TypeScript.
- 9. What is type null and its use in TypeScript?
- 10. Describe the syntax for creating objects in TypeScript.
- 11. Can we specify the optional properties to TypeScript Object, if Yes, explain How?
- 12. Explain the undefined type in TypeScript.
- 13. Explain the behavior of arrays in TypeScript.
- 14. How can you compile a TypeScript file?
- 15. Differentiate between the .ts and .tsx file extensions given to the TypeScript file.
- 16. What is "in" operator and why it is used in TypeScript?
- 17. Explain the union types in TypeScript?
- 18. Explain type alias in TypeScript?
- 19. Is TypeScript strictly statically typed language?
- 20. Is template literal supported by TypeScript?
- 21. How to declare a arrow function in TypeScript?
- 22. How to define a function which accepts the optional parameters?
- 23. Explain noImplicitAny in TypeScript.
- 24. What are interfaces in TypeScript?
- 25. In how many ways you can use the for loop in TypeScript?
- 26. What is never type and its uses in TypeScript?
- 27. Explain the working of enums in TypeScript?
- 28. Explain the parameter destructuring in TypeScript.
- 29. Explain type inference in TypeScript.
- 30. What are modules in TypeScript?
- 31. In how many ways you can classify Modules?
- 32. What is the use of tsconfig.json file in TypeScript?
- 33. What are Decorators in TypeScript?
- 34. How to debug a TypeScript file?
- 35. Describe anonymous functions and their uses in TypeScript?
- 36. Is it possible to call the constructor function of the base class using the child class?
- 37. How to combine multiple TypeScript files and convert them into single JavaScript file?
- 38. Explain type of operator in TypeScript and where to use it.
- 39. How you can compile a TypeScript file?
- 40. Which principles of Object Oriented Programming are supported by TypeScript?
- 41. Explain Mixins in TypeScript
- 42. Is it possible to create the immutable Object properties in TypeScript?
### TypeScript Interview Questions For Experienced

- 43. In what situation you should use a class and a interface?
- 44. What are the differences between the classes and the interfaces in TypeScript?
- 45. How to declare a class in TypeScript?
- 46. How the inheritance can be used in TypeScript?
- 47. What are the different ways for controlling the visibility of member data?
- 48. How to convert a .ts file into TypeScript Definition file?
- 49. Is it possible to create the static classes in TypeScript?
- 50. Explain conditional typing in TypeScript?

## Modernisation added on top of the source list

The source list skews toward TS 2–4 basics. `src/data/typescript.ts` also covers, tagged
`modern-ts`:

- `satisfies` operator; `as const` and const type parameters
- Template literal types, mapped types with key remapping (`as`), recursive conditional types
- `infer`, distributive conditional types, variance annotations (`in` / `out`)
- Discriminated unions and exhaustiveness checking with `never`
- Utility types: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`,
  `Extract`, `NonNullable`, `Parameters`, `ReturnType`, `Awaited`, `NoInfer`
- Type predicates, assertion functions (`asserts x is T`)
- `unknown` vs `any` vs `never`; `strictNullChecks`, `noUncheckedIndexedAccess`
- Declaration merging, module augmentation, ambient declarations (`.d.ts`)
- `verbatimModuleSyntax`, `import type`, `isolatedModules`, ESM vs CommonJS interop
- Generic constraints, default type parameters, higher-order generic inference
- Branded / nominal types, `unique symbol`
- Decorators (TC39 stage-3 form shipped in TS 5.0) vs legacy `experimentalDecorators`
- `using` / `await using` and explicit resource management
