function buildTree(services) {
  const findChildren = (parent) => {
    const children = services
      .filter((service) => service.head === parent.id)
      .sort((a, b) => a.sorthead - b.sorthead);
    if (children.length) {
      parent.children = [];
      children.forEach((child) => {
        parent.children.push(child);
        findChildren(child);
      });
    }
  };

  const rootServices = services
    .filter((service) => service.head === null)
    .sort((a, b) => a.sorthead - b.sorthead);

  rootServices.forEach((rootService) => {
    findChildren(rootService);
  });

  return rootServices;
}

function hiddenChildren(div) {
  div.className = "node";
  div.addEventListener("click", () => {
    const ul = div.nextSibling;
    if (ul.style.display == "none") {
      ul.style.display = "";
    } else {
      ul.style.display = "none";
    }
  });
}

function renderTree(node, parentElement) {
  if (!node || node.length === 0) return;

  const ul = document.createElement("ul");

  node.forEach((child) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.textContent = `${child.name} (Цена: ${child.price}руб.)`;

    if (child.node) hiddenChildren(div);

    li.appendChild(div);
    ul.appendChild(li);

    if (child.children && child.children.length > 0) {
      renderTree(child.children, li);
    }
  });
  parentElement.appendChild(ul);
}

async function main() {
  const res = await fetch("./servicesData.json");
  const servicesData = await res.json();
  const tree = buildTree(servicesData.services);

  const treeContainer = document.getElementById("tree");
  renderTree(tree, treeContainer);
}

main();
