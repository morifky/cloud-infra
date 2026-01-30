locals {
  tags = {
    Env     = var.environment
    Project = var.project_name
  }
  name        = "${var.project_name}-${var.environment}"
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 21.0"

  name               = local.name
  kubernetes_version = var.cluster_version

  # Networking
  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids

  endpoint_public_access  = var.endpoint_public_access
  endpoint_private_access = var.endpoint_private_access

  # Access Entry
  authentication_mode                      = var.authentication_mode
  enable_cluster_creator_admin_permissions = var.enable_cluster_creator_admin_permissions
  access_entries                           = var.access_entries

  addons = merge(
    {
      eks-pod-identity-agent = {
        most_recent = true
      }
    },
    var.eks_addons
  )

  iam_role_additional_policies = {
    AmazonSSMManagedInstanceCore = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  }

  eks_managed_node_groups = var.eks_managed_node_groups
  tags                    = local.tags
}
