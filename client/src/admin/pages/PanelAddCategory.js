import React from 'react';
import PanelMenu from "../components/PanelMenu";
import PanelCategoriesContent from "../components/PanelCategoriesContent";
import PanelAddCategoryContent from "../components/PanelAddCategoryContent";

const PanelAddCategory = () => {
    return <main className="panel">
        <PanelMenu active={4} />
        <PanelAddCategoryContent />
    </main>
};

export default PanelAddCategory;
