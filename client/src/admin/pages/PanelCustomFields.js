import React from 'react';
import PanelMenu from "../components/PanelMenu";
import PanelCouponsContent from "../components/PanelCouponsContent";
import PanelCustomFieldsContent from "../components/PanelCustomFieldsContent";

const PanelCustomFields = () => {
    return <main className="panel">
        <PanelMenu active={9} />
        <PanelCustomFieldsContent />
    </main>
};

export default PanelCustomFields;
