import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/adventurer";

const svgAvatarGenerator = (seed, config) => {
  let svg = createAvatar(style, {
    seed: seed,
    ...config,
  });

  return svg;
};

export default svgAvatarGenerator;
