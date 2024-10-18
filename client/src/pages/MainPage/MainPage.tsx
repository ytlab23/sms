import React from 'react';

import { ChooseService } from '../../components/shadcn/chooseservice';
import { Features } from '../../components/shadcn/home';

const MainPage: React.FC = () => {
  return (
    <>
      <div className="flex lg:hidden">
        <ChooseService></ChooseService>
      </div>
      <Features></Features>
    </>
  );
};

export default MainPage;
