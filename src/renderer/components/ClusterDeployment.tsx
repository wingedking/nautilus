/**
 * ************************************
 *
 * @module  ComposeDeployment.tsx
 * @author David Soerensen
 * @date 3/11/20
 * @description container for the title, the service info and the file open
 *
 * ************************************
 */

 import React from 'react'

import SwarmDeployment from './SwarmDeployment';
import { FileOpen } from '../App.d';
 
type Props = {
  fileOpen: FileOpen;
  currentFilePath: string;
 }
 
const ClusterDeployment: React.FC<Props> = ({
  fileOpen,
  currentFilePath,
}) => {
   return (
     <div>
      <SwarmDeployment currentFilePath={currentFilePath} />
      {/* <KubeDeployment currentFilePath={currentFilePath} /> */}
     </div>
   )
 }

 export default ClusterDeployment
 