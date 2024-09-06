import React from 'react';

import { ChooseService } from '../../components/shadcn/chooseservice';
import { Features } from '../../components/shadcn/services';

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="flex lg:hidden">
   <ChooseService></ChooseService>
      </div>
      <Features></Features>

     
    </>
  );
};

export default ECommerce;
