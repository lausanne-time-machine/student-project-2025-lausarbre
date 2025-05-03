from .models import GenealogyNode


class GenealogyTree:
    @staticmethod
    def depth(node: GenealogyNode) -> int:
        """
        Returns the depth of the tree.
        """
        if len(node["children"]) == 0:
            return 1
        return 1 + max(GenealogyTree.depth(child) for child in node["children"])

    @staticmethod
    def size(node: GenealogyNode, include_leaf_children: bool = False) -> int:
        """
        Returns the size of the tree.
        """
        size = 1

        if include_leaf_children:
            size += len(node["leaf_children"])

        if len(node["children"]) == 0:
            return size

        for child in node["children"]:
            size += GenealogyTree.size(
                child,
                include_leaf_children=include_leaf_children,
            )

        return size

    @staticmethod
    def trim_wife(node: GenealogyNode) -> GenealogyNode | None:
        """
        Trims the tree to only include husbands nodes.

        Returns a new tree with only the husbands nodes.
        """
        if not node["is_husband"]:
            return None
        trimmed_node = node.copy()
        trimmed_node["children"] = []
        for child in node["children"]:
            trimmed_child = GenealogyTree.trim_wife(child)
            if trimmed_child is not None:
                trimmed_node["children"].append(trimmed_child)
        return trimmed_node
