variable "aws_region" {
  description = "AWS region where the EKS cluster and associated resources will be deployed."
  type        = string
  default     = "ap-northeast-1"
}

variable "project_name" {
  description = "Name of the project, used as a prefix for resource naming and tagging."
  type        = string
}

variable "environment" {
  description = "Environment name (e.g., 'dev', 'stag', 'prod') used for resource isolation and tagging."
  type        = string
}

variable "cluster_version" {
  description = "The Kubernetes version for the EKS cluster (e.g., '1.31')."
  type        = string
  default     = "1.31"
}

variable "vpc_id" {
  description = "The ID of the VPC where the EKS cluster and VPC resources will be provisioned."
  type        = string
  default     = ""
}

variable "subnet_ids" {
  description = "A list of subnet IDs where the EKS cluster control plane and managed node groups will be placed."
  type        = list(string)
  default     = []
}

variable "eks_addons" {
  description = "A map of EKS addon configurations to be installed on the cluster."
  type        = any
  default     = {}
}

variable "eks_managed_node_groups" {
  description = "A map of EKS managed node group definitions, including instance types, scaling, and IAM policies."
  type        = any
  default     = {}
}

variable "enable_cluster_creator_admin_permissions" {
  description = "Indicates whether to automatically add the IAM identity used by Terraform as a cluster administrator via an EKS Access Entry."
  type        = bool
  default     = true
}

variable "authentication_mode" {
  description = "The authentication mode for the EKS cluster. Valid values: 'CONFIG_MAP', 'API', or 'API_AND_CONFIG_MAP'."
  type        = string
  default     = "API_AND_CONFIG_MAP"
}

variable "access_entries" {
  description = "A map of EKS Access Entry configurations to manage cluster permissions for IAM principals."
  type        = any
  default     = {}
}

variable "endpoint_public_access" {
  description = "Indicates whether the Amazon EKS public API server endpoint is enabled."
  type        = bool
  default     = false
}

variable "endpoint_private_access" {
  description = "Indicates whether the Amazon EKS private API server endpoint is enabled."
  type        = bool
  default     = true
}