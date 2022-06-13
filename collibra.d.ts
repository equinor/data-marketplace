declare namespace Collibra {
  type ResourceType =
    | "View"
    | "Asset"
    | "Community"
    | "Domain"
    | "AssetType"
    | "DomainType"
    | "Status"
    | "User"
    | "ClassificationMatch"
    | "UserGroup"
    | "Attribute"
    | "StringAttribute"
    | "ScriptAttribute"
    | "BooleanAttribute"
    | "DateAttribute"
    | "NumericAttribute"
    | "SingleValueListAttribute"
    | "MultiValueListAttribute"
    | "Comment"
    | "Attachment"
    | "Responsibility"
    | "Workflow"
    | "Job"
    | "Relation"
    | "RelationType"
    | "ComplexRelation"
    | "ComplexRelationType"
    | "ArticulationRule"
    | "Assignment"
    | "Scope"
    | "RelationTrace"
    | "ValidationRule"
    | "DataQualityRule"
    | "DataQualityMetric"
    | "Address"
    | "InstantMessagingAccount"
    | "Email"
    | "PhoneNumber"
    | "Website"
    | "Activity"
    | "FormProperty"
    | "WorkflowTask"
    | "ActivityChange"
    | "WorkflowInstance"
    | "Role"
    | "AttributeType"
    | "BooleanAttributeType"
    | "DateAttributeType"
    | "DateTimeAttributeType"
    | "MultiValueListAttributeType"
    | "NumericAttributeType"
    | "ScriptAttributeType"
    | "SingleValueListAttributeType"
    | "StringAttributeType"
    | "ViewSharingRule"
    | "ViewAssignmentRule"
    | "JdbcDriverFile"
    | "JdbcDriver"
    | "JdbcIngestionProperties"
    | "CsvIngestionProperties"
    | "ExcelIngestionProperties"
    | "ConnectionStringParameter"
    | "AssignedCharacteristicType"
    | "Notification"
    | "Tag"
    | "ComplexRelationLegType"
    | "ComplexRelationAttributeType"
    | "ComplexRelationLeg"
    | "BaseDataType"
    | "AdvancedDataType"
    | "DiagramPicture"
    | "DiagramPictureSharingRule"
    | "DiagramPictureAssignmentRule"
    | "Rating"
    | "Classification"
    | "PhysicalDataConnector"
    | "Context"

  type Resource = {
    id: string
    createdBy: string
    createdOn: number
    lastModifiedBy: string
    lastModifiedOn: number
    system: boolean
    resourceType: ResourceType
  }

  type ResourceReference = {
    id: string
    resourceType: ResourceType
  }

  type NamedResourceReference = ResourceReference & {
    name?: string | null
  }

  type Resource = ResourceReference & {
    createdBy: string
    createdOn: number
    lastModifiedBy: string
    lastModifiedOn: number
    system: boolean
  }

  export type Attribute = {
    asset: NamedResourceReference
    value: any
    type: NamedResourceReference
  }

  export type Asset = Resource & {
    name: string
    displayName: string
    articulationScore: number
    excludedFromAutoHyperlinking: boolean
    domain: NamedResourceReference
    type: NamedResourceReference
    status: NamedResourceReference
    avgRating: number
    ratingsCount: number
  }

  export type Responsibility = Resource & {
    role: NamedResourceReference
    baseResource: ResourceReference
    owner: ResourceReference
  }

  type Email = Resource & {
    emailAddress: string
  }

  type PhoneNumber = Resource & {
    type: "FAX" | "MOBILE" | "OTHER" | "PAGER" | "PRIVATE" | "WORK"
    phoneNumber: string
  }

  type InstantMessagingAccount = Resource & {
    account: string
    type: "AOL" | "GTALK" | "ICQ" | "JABBER" | "LIVE_MESSENGER" | "SKYPE" | "YAHOO_MESSENGER"
  }

  type Website = Resource & {
    url: string
    type: "FACEBOOK" | "LINKEDIN" | "MYSPACE" | "TWITTER" | "WEBSITE"
  }

  type Address = Resource & {
    city: string
    street: string
    number: string
    state: string
    country: string
    postalCode: string
    type: "HOME" | "WORK"
  }

  export type User = Resource & {
    userName: string
    firstName: string
    lastName: string
    emailAddress: string
    gender: "MALE" | "FEMALE" | "UNKNOWN"
    language: string
    additionalEmailAddresses: Email[]
    phoneNumbers: PhoneNumber[]
    instantMessagingAccounts: InstantMessagingAccount[]
    websites: Website[]
    addresses: Address[]
    activated: boolean
    enabled: boolean
    ldapUser: boolean
    userSource: "INTERNAL" | "LDAP" | "SSO"
    guestUser: boolean
    apiUser: boolean
    licenseType: "CONSUMER" | "AUTHOR"
  }

  export type NavigationStatistic = {
    assetId: string
    name: string
    numberOfViews: number
    lastViewedDate: number
  }

  export type Community = Resource & {
    name: string
    description: string
  }

  interface PagedResponse<T = any> {
    total: number
    offset: number
    limit: number
    results: T[]
  }

  export interface PagedAttributeResponse extends PagedResponse<Attribute> {}
  export interface PagedAssetResponse extends PagedResponse<Asset> {}
  export interface PagedResponsibilityResponse extends PagedResponse<Responsibility> {}
  export interface PagedUserResponse extends PagedResponse<User> {}
  export interface PagedNavigationStatisticResponse extends PagedResponse<NavigationStatistic> {}
  export interface PagedCommunityResponse extends PagedResponse<Community> {}
}
