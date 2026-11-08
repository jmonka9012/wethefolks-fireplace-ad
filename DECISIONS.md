# Implementation decisions

- **One shared background.** Using `bg-big.jpg` instead of separate crops made synchronized animation easier to design and implement. All three creatives show the same image at 50% scale, using shared coordinates and the same zoom origin.
- **Provided text artwork.** Text was supplied as raster images, so I used those assets and animated each as a complete layer rather than recreating the typography. I chose between asset alternatives only where the brief explicitly allowed it, such as the background.
- **No animation library.** The project is small enough for the native Web Animations API. An additional animation library would add an unnecessary dependency.
- **Separate creatives.** Each HTML document runs independently. The preview waits until all three are ready and sends a shared start time through `postMessage`.
- **Motion and accessibility.** Reduced motion displays the final layout immediately; the preview checkbox can simulate either preference.
- **Asset handling and weight.** Original artwork was retained without re-encoding. Black padding is clipped with CSS, and unused background crops were removed. Runtime files, including the preview, total approximately 2.25 MB. The reference design and development files are excluded from that runtime total.
