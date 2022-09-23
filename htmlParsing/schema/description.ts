import Schema from "@sanity/schema"

// Start with compiling a schema we can work against
export const descriptionSchema = Schema.compile({
  name: "assetDescription",
  types: [
    {
      type: "object",
      name: "description",
      fields: [
        {
          title: "Body",
          name: "body",
          type: "array",
          of: [{ type: "block" }],
        },
      ],
    },
  ],
})
