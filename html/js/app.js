document.addEventListener("DOMContentLoaded", function () {
    const config = {
        StandardEyeIcon: "fa-solid fa-circle",
        StandardColor: "white",
        SuccessColor: "#4169E1",
        TextColor: "#4169E1",
        BackgroundColor: "linear-gradient(to bottom, rgba(129, 186, 194, 0.8), rgba(15, 187, 255, 0.8))",
        BorderColor: "#4169E1",
        LineColor: "#4169E1",
    };

    const targetEye = document.getElementById("target-eye");
    const targetLabel = document.getElementById("target-label");
    const TargetEyeStyleObject = targetEye.style;

    function applyColors() {
        TargetEyeStyleObject.color = config.LineColor;
        document.querySelectorAll('.connector-line, .branch-curve-left, .branch-curve-right, .branch-line').forEach(element => {
            if (element.classList.contains('connector-vertical')) {
                element.style.backgroundColor = config.LineColor;
            } else if (element.classList.contains('branch-curve-left') || element.classList.contains('branch-curve-right')) {
                element.style.borderColor = config.LineColor;
            } else {
                element.style.backgroundColor = config.LineColor;
            }
        });

        document.querySelectorAll('.target-option').forEach(element => {
            element.style.backgroundColor = config.BackgroundColor;
            element.style.color = config.TextColor;
            element.style.borderColor = config.BorderColor;
        });
    }

    function OpenTarget(data) {
        targetLabel.textContent = "";
        targetEye.style.display = "block";
        targetEye.className = config.StandardEyeIcon;

        if (data?.colors) {
            config.StandardColor = data.colors.EyeColor || config.StandardColor;
            config.LineColor = data.colors.LineColor || config.LineColor;
            config.SuccessColor = data.colors.LineColor || config.SuccessColor;
            config.TextColor = data.colors.TextColor || config.TextColor;
            config.BackgroundColor = data.colors.ButtonBackgroundColor || config.BackgroundColor;
            config.BorderColor = data.colors.ButtonBorderColor || config.BorderColor;
        }

        TargetEyeStyleObject.color = config.StandardColor;
    }

    function CloseTarget() {
        targetLabel.textContent = "";
        targetEye.style.display = "none";
    }

    function createConnectors() {
        const verticalLine = document.createElement("div");
        verticalLine.className = "connector-line connector-vertical";
        targetLabel.appendChild(verticalLine);
    }

    function createBranch(level, totalLevels) {
        const branchContainer = document.createElement("div");
        branchContainer.className = "branch-container";

        const basePosition = 43;
        const branchSpacing = 5;
        const invertedLevel = totalLevels - level - 1;
        const topOffset = basePosition - (invertedLevel * branchSpacing);

        branchContainer.style.top = `${topOffset}%`;

        ["left", "right"].forEach(side => {
            const curve = document.createElement("div");
            curve.className = `branch-curve-${side}`;
            branchContainer.appendChild(curve);

            const line = document.createElement("div");
            line.className = `branch-line branch-line-${side} branch-line-${side}-${level}`;
            branchContainer.appendChild(line);
        });

        targetLabel.appendChild(branchContainer);
        return branchContainer;
    }

    function organizeOptions(options) {
        const branches = [];
        let currentBranch = [];
        let topOption = null;
        const keys = Object.keys(options);

        if (keys.length % 2 !== 0) {
            const firstKey = keys.shift();
            topOption = { index: firstKey, itemData: options[firstKey] };
        }

        keys.forEach((key, i) => {
            currentBranch.push({ index: key, itemData: options[key] });
            if (currentBranch.length === 2 || i === keys.length - 1) {
                branches.push([...currentBranch]);
                currentBranch = [];
            }
        });

        return { branches, topOption };
    }

    function createTargetOption(branchContainer, position, index, itemData, level) {
        if (!itemData) return;

        const targetOption = document.createElement("div");
        targetOption.id = `target-option-${Number(index) + 1}`;
        targetOption.className = "target-option";
        targetOption.classList.add(position === 0 ? "target-option-left" : "target-option-right");
        targetOption.classList.add(`${position === 0 ? "target-option-left" : "target-option-right"}-${level}`);
        targetOption.style.top = branchContainer.style.top;
        targetOption.style.backgroundColor = config.BackgroundColor;
        targetOption.style.color = config.TextColor;
        targetOption.style.borderColor = config.BorderColor;

        const targetIcon = document.createElement("span");
        targetIcon.id = `target-icon-${Number(index) + 1}`;
        targetIcon.className = "target-icon";

        const icon = document.createElement("i");
        icon.className = itemData.icon;
        targetIcon.appendChild(icon);
        targetIcon.appendChild(document.createTextNode(" "));

        targetOption.appendChild(targetIcon);
        targetOption.appendChild(document.createTextNode(itemData.label));
        targetLabel.appendChild(targetOption);
    }

    function createTopOption(index, itemData, totalOptionsCount) {
        if (!itemData) return;

        const targetOption = document.createElement("div");
        targetOption.id = `target-option-${Number(index) + 1}`;
        targetOption.className = "target-option target-option-top";
        targetOption.style.backgroundColor = config.BackgroundColor;
        targetOption.style.color = config.TextColor;
        targetOption.style.borderColor = config.BorderColor;

        const topOffset = Math.max(0, (totalOptionsCount - 1) * 2.5);
        const topPosition = 40 - topOffset;
        targetOption.style.setProperty('--top-option-position', `${topPosition}%`);
        targetOption.dataset.topPosition = topPosition;

        const targetIcon = document.createElement("span");
        targetIcon.id = `target-icon-${Number(index) + 1}`;
        targetIcon.className = "target-icon";

        const icon = document.createElement("i");
        icon.className = itemData.icon;
        targetIcon.appendChild(icon);
        targetIcon.appendChild(document.createTextNode(" "));

        targetOption.appendChild(targetIcon);
        targetOption.appendChild(document.createTextNode(itemData.label));
        targetLabel.appendChild(targetOption);
    }

    function adjustVerticalLineHeight() {
        const verticalLine = document.querySelector('.connector-vertical');
        const branchContainers = document.querySelectorAll('.branch-container');
        const topOption = document.querySelector('.target-option-top');

        if (!verticalLine) return;

        if (branchContainers.length === 0 && !topOption) {
            verticalLine.style.height = '0%';
            return;
        }

        let highestBranchTop = 50;
        branchContainers.forEach(branch => {
            const top = parseFloat(branch.style.top);
            if (top < highestBranchTop) highestBranchTop = top;
        });

        if (topOption) {
            const top = parseFloat(topOption.dataset.topPosition || 50);
            highestBranchTop = top;
        }

        const lineHeight = Math.abs(50 - highestBranchTop) - 1 + '%';
        verticalLine.style.height = lineHeight;
        verticalLine.style.bottom = '50%';
        verticalLine.style.top = 'auto';
    }

    function FoundTarget(item) {
        if (item.data) {
            targetEye.className = item.data;
        }

        TargetEyeStyleObject.color = config.LineColor;
        targetLabel.textContent = "";

        createConnectors();
        const { branches, topOption } = organizeOptions(item.options);

        if (topOption) {
            createTopOption(topOption.index, topOption.itemData, Object.keys(item.options).length);
        }

        branches.forEach((branchItems, level) => {
            const branchContainer = createBranch(level, branches.length);
            branchItems.forEach(({ index, itemData }, position) => {
                createTargetOption(branchContainer, position, index, itemData, level);
            });
        });

        setTimeout(adjustVerticalLineHeight, 0);
        setTimeout(applyColors, 10);
    }

    function handleMouseDown(event) {
        let el = event.target;
        while (el && el.parentElement) {
            if (el.id?.startsWith("target-option-")) break;
            el = el.parentElement;
        }

        if (el?.id?.startsWith("target-option-") && event.button === 0) {
            const [, , index] = el.id.split("-");
            fetch(`https://${GetParentResourceName()}/selectTarget`, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: JSON.stringify(index),
            }).catch(console.error);
            targetLabel.textContent = "";
        }
    }

    function handleKeyDown(event) {
        if (["Escape", "Backspace"].includes(event.key)) {
            CloseTarget();
            fetch(`https://${GetParentResourceName()}/closeTarget`, {
                method: "POST",
                headers: { "Content-Type": "application/json; charset=UTF-8" },
                body: "",
            }).catch(console.error);
        }
    }

    function handleHover(event, type) {
        let el = event.target;
        while (el && el.parentElement) {
            if (el.id?.startsWith("target-option-")) break;
            el = el.parentElement;
        }

        if (!el?.id?.startsWith("target-option-")) return;

        const transform = el.classList.contains("target-option-top")
            ? "translateX(-50%)"
            : "translateY(-50%)";

        el.style.transform = type === "over" ? `${transform} scale(1.05)` : transform;
    }

    window.addEventListener("message", function (event) {
        switch (event.data.response) {
            case "openTarget": OpenTarget(event.data); break;
            case "closeTarget": CloseTarget(); break;
            case "foundTarget": FoundTarget(event.data); break;
        }
    });

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("mouseover", e => handleHover(e, "over"));
    window.addEventListener("mouseout", e => handleHover(e, "out"));

    window.addEventListener("unload", function () {
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("mouseover", handleHover);
        window.removeEventListener("mouseout", handleHover);
    });
});
