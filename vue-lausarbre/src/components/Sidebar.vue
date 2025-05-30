<template>
	<aside class="aside">
		<h3>Menu</h3>
		<div class="menu">
			<router-link to="/" class="button">
				<span class="text">Présentation</span>
			</router-link>
			<router-link to="/HomePage" class="button">
				<span class="text">Arbres généalogiques</span>
			</router-link>
		</div>

	</aside>
</template>

<script setup>
import "../styles/main.css"
</script>

<style lang="scss" scoped>
.aside {
	flex-direction: column;
	overflow: hidden;
	background-color: var(--sidebar-bg);
	width: var(--sidebar-width, 260px);
	padding: 1.5rem 1rem;
	box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);

}

.aside h3 {
	font-size: 1.5rem;
	font-weight: 600;
	margin-bottom: 2rem;
	color: var(--sidebar-symbols);
}

.menu {
	display: flex;
	flex-direction: column;
	gap: 1rem;
}

.button {
	display: flex;
	align-items: center;
	padding: 0.75rem 1rem;
	border-radius: 8px;
	color: var(--sidebar-text);
	background-color: transparent;
	text-decoration: none;
	font-weight: 500;
	transition: background-color 0.2s, transform 0.2s;
}

.button:hover {
	background-color: var(--sidebar-hover);
	transform: translateX(4px);
}

.button.router-link-exact-active {
	background-color: var(--sidebar-selected);
	font-weight: 600;
}

.text {
	margin-left: 0.5rem;
}
</style>