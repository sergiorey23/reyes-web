import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({
  projectId: '1arljs9t',
  dataset: 'production',
});

export function urlFor(source) {
  return builder.image(source);
}
