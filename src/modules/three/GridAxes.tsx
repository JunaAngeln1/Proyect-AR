import * as React from 'react';
import * as THREE from 'three';
import { Grid } from '@react-three/drei';
import { AxesHelper } from 'three';

interface GridAxesProps {
  showGrid: boolean;
  showAxes: boolean;
  size: number;
  divisions: number;
}

export function GridAxes({ showGrid, showAxes, size, divisions }: GridAxesProps) {
  return (
    <>
      {showGrid && (
        <Grid
          args={[size, divisions]}
          cellColor="#151D30"
          cellThickness={1}
          sectionColor="#3987FF"
          sectionThickness={2}
        />
      )}
      {showAxes && <primitive object={new AxesHelper(3)} />}
    </>
  );
}
