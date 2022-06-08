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

  type ResourceReference = {
    id: string
    resourceType: ResourceType
  }

  type NamedResourceReference = ResourceReference & {
    name?: string | null
  }

  export type Attribute = {
    asset: NamedResourceReference
    value: any
    type: NamedResourceReference
    resourceType: ResourceType
    createdBy: string
    lastModifiedBy: string
    createdOn: number
    lastModifiedOn: number
    system: boolean
    id: string
  }

  export type Asset = {
    id: string
    createdBy: string
    createdOn: number
    lastModifiedBy: string
    lastModifiedOn: number
    system: true
    resourceType: ResourceType
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

  export type Responsibility = {
    id: string
    createdBy: string
    createdOn: number
    lastModifiedBy: string
    lastModifiedOn: number
    system: boolean
    resourceType: ResourceType
    role: NamedResourceReference
    baseResource: ResourceReference
    owner: ResourceReference
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
}
