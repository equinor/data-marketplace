import { render, screen } from "@testing-library/react"

import { AssetCard } from "./AssetCard"

describe("AssetCard", () => {
  it("renders no meta container", () => {
    const { container } = render(<AssetCard id="abc-123" description="some description" title="some title" />)
    expect(screen.queryByTestId("meta-container")).not.toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it("renders meta container", () => {
    const meta = [{ label: "Some label", value: "Some value" }]
    const { container } = render(
      <AssetCard
        id="abc-123"
        meta={meta}
        description="some description"
        title="some title"
      />,
    )
    const metaContainer = screen.queryByTestId("meta-container")
    expect(metaContainer).toBeInTheDocument()
    expect(metaContainer?.children.length).toBe(meta.length)
    expect(container).toMatchSnapshot()
  })
})
