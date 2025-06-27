// import "mathlive";
// import { useEffect, useRef, useState } from "react";

// export default function MathEditor() {
//   const mathFieldRef = useRef<HTMLElement>(null);
//   const [latex, setLatex] = useState("\\frac{1}{2}");

//   useEffect(() => {
//     if (mathFieldRef.current) {
//       (mathFieldRef.current as any).setOptions?.({
//         virtualKeyboardMode: "onfocus",
//         smartFence: true,
//       });
//     }
//   }, []);

//   return (
//     <div>
//       <math-field
//         ref={mathFieldRef}
//         value={latex}
//         style={{ width: "100%", fontSize: "20px" }}
//         onInput={(e: Event) =>
//           setLatex((e.target as any).value)
//         }
//       ></math-field>

//       <p style={{ marginTop: "20px" }}>
//         👉 LaTeX: <code>{latex}</code>
//       </p>
//     </div>
//   );
// }
