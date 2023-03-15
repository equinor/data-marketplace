import { Icon, Typography } from "@equinor/eds-core-react"
import type { IconData } from "@equinor/eds-icons"
import { tokens } from "@equinor/eds-tokens"
import type { FunctionComponent, PropsWithChildren } from "react"
import styled, { css } from "styled-components"

type BannerVariant = "info" | "warning" | "error" | "none"

type Props = PropsWithChildren<{
  variant?: BannerVariant
  icon?: IconData
}>

const getContainerVariantStyles = (variant: BannerVariant) =>
  ((
    {
      error: css`
        --container-background: ${tokens.colors.ui.background__danger.hex};
        --container-border-color: transparent;
      `,
      info: css`
        --container-background: ${tokens.colors.ui.background__default.hex};
        --container-border-color: rgba(0, 0, 0, 0.14);
      `,
      warning: css`
        --container-background: ${tokens.colors.interactive.warning__highlight.hex};
        --container-border-color: transparent;
      `,
      none: css`
        --container-background: transparent;
        --container-border-color: transparent;
      `,
    } as Record<BannerVariant, ReturnType<typeof css>>
  )[variant])

const Container = styled.div<{ variant: BannerVariant }>`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 0.5rem;
  padding: 1rem;
  align-items: center;
  border-radius: ${tokens.shape.corners.borderRadius};
  border: 1px solid;

  ${({ variant }) => getContainerVariantStyles(variant)}
  background-color: var(--container-background);
  border-color: var(--container-border-color);
`

const getIconContainerVariantStyles = (variant: BannerVariant) =>
  ((
    {
      error: css``,
      info: css``,
      warning: css`
        --icon-background: ${tokens.colors.logo.fill_negative.hex};
        --icon-fill: ${tokens.colors.interactive.warning__text.hex};
      `,
      none: css``,
    } as Record<BannerVariant, ReturnType<typeof css>>
  )[variant])

const IconContainer = styled.span<{ variant: BannerVariant }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 2.5rem;
  width: 2.5rem;
  border-radius: 50%;

  ${({ variant }) => getIconContainerVariantStyles(variant)}
  background-color: var(--icon-background);
  color: var(--icon-fill);
`

export const Banner: FunctionComponent<Props> = ({ children, icon, variant = "info" }) => (
  <Container variant={variant}>
    {icon && (
      <IconContainer variant={variant}>
        <Icon data={icon} />
      </IconContainer>
    )}
    <Typography style={{ fontFamily: "inherit" }}>{children}</Typography>
  </Container>
)
