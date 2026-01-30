include "root" {
  path = find_in_parent_folders("root.hcl")
  expose = true
}

terraform {
  source = "${get_path_to_repo_root()}//infrastructure-overlay/modules/eks/v1.0.0"
}

inputs = {
  cluster_version = "1.33"
  vpc_id     = "vpc-0123456789abcdef0"
  subnet_ids = ["subnet-0123456789abcdef0", "subnet-0123456789abcdef1"]

  authentication_mode                         = "API_AND_CONFIG_MAP"
  enable_cluster_creator_admin_permissions     = true
  
  access_entries = {
    # Example: Allow a specific IAM role to be cluster admin
     admin = {
       principal_arn     = "arn:aws:iam::${include.root.locals.account_id}:role/admin-role"
       policy_associations = {
         admin = {
           policy_arn = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"
           access_scope = {
             type = "cluster"
           }
         }
       }
     }
  }

  # Managed Node Groups
  eks_managed_node_groups = {
    default = {
      instance_types = ["t3.medium"]
      min_size     = 1
      max_size     = 3
      desired_size = 2
      ami_type       = "AL2023_x86_64_STANDARD"
    }
  }

  # Addons
  eks_addons = {
    vpc-cni = {
      most_recent = true
      resolve_conflicts_on_create = "OVERWRITE"
      resolve_conflicts_on_update = "OVERWRITE"
      # example of pod identity association
      pod_identity_association = {
        role_arn = "arn:aws:iam::${include.root.locals.account_id}:role/AmazonEKSPodIdentityAmazonVPCCNIRole"
        service_account = "aws-node"
      }
    }
    coredns = {
      most_recent = true
    }
    kube-proxy = {
      most_recent = true
    }
  }
}
