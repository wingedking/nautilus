/**
 * ************************************
 *
 * @module  LeftNav.tsx
 * @author
 * @date 3/11/20
 * @description container for the title, the service info and the file open
 *
 * ************************************
 */
import React from 'react';

// IMPORT REACT COMPONENTS
import ServiceInfo from './ServiceInfo';
import FileSelector from './FileSelector';
import ComposeDeployment from './ComposeDeployment';
import ClusterDeployment from './ClusterDeployment'
import Title from './Title';
import { FileOpen, Service } from '../App.d';


type Props = {
  service: Service;
  selectedContainer: string;
  fileOpen: FileOpen;
  fileOpened: boolean;
  currentFilePath: string;
};

const LeftNav: React.FC<Props> = ({
  fileOpen,
  fileOpened,
  selectedContainer,
  service,
  currentFilePath
}) => {
  return (
    <div className="left-nav">
      <div className="top-half">
        <Title />
        {fileOpened ? <FileSelector fileOpen={fileOpen} /> : null}
      </div>
      <ServiceInfo selectedContainer={selectedContainer} service={service} />
      <ComposeDeployment currentFilePath={currentFilePath} fileOpen={fileOpen}/>
      <ClusterDeployment currentFilePath={currentFilePath} fileOpen={fileOpen}/>
    </div>
  );
};

export default LeftNav;
