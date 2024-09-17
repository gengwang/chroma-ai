'use client';

import React from 'react';
import { ColorPalette } from '../ColorPaletteVisualizer';
import * as Plot from "@observablehq/plot";
// import {tree, cluster} from 'd3';

interface TreeProps {
    colorPalettes: ColorPalette[];
    keyword: string;
}

const Tree: React.FC<TreeProps> = ({ colorPalettes, keyword }) => {
    // const treeData: TreeNode = {
    //     name: keyword,
    //     children: colorPalettes.map(palette => ({
    //         name: palette.theme,
    //         children: palette.colors?.map(color => ({ name: color })) || []
    //     }))
    // };

    const transformTreeData = (keyword: string, colorPalettes: ColorPalette[]) => {
        return colorPalettes.flatMap(palette => 
            palette.colors?.length ? 
                palette.colors.map(color => ({
                    name: `${keyword}/${palette.theme}/${color}`,
                    size: null
                })) : 
                [{
                    name: `${keyword}/${palette.theme}/No colors available`,
                    size: null
                }]
        );
    };

    const transformedTreeData = transformTreeData(keyword, colorPalettes);

    // console.log("treeData", treeData);
    // console.log("transformedTreeData", transformedTreeData);
    
    React.useEffect(() => {
        const div = document.querySelector("#myplot");
        if (div) {
            // Clear previous content
            div.innerHTML = '';
            
            const plot = Plot.plot({
                axis: null,
                margin: 20,
                marginTop: 80,
                marginBottom: 160,
                marginRight: 160,
                // width: 1800,
                // height: 928,
                marks: [
                    Plot.tree(transformedTreeData, {
                        path: "name",
                        delimiter: "/",
                        // treeLayout: cluster,
                        textLayout: 'normal',
                        textStroke: "white",
                        fill: (d) => d && d.name ? (d.name.split("/").length === 3 ? d.name.split("/")[2] : "black") : "black",
                        fontSize: (d) => d && d.name ? (d.name.split("/").length === 3 ? 8 : 16) : 16,
                        r: 6,
                        // treeSort: "node:height",
                    })
                ]
            });

            div.appendChild(plot);
        }

        // Cleanup function
        return () => {
            if (div) {
                div.innerHTML = '';
            }
        };
    }, [colorPalettes, keyword]);

    /* function update(event: any, source: any) {
    }
    update(null, null); */

    return (
        <div id="myplot"></div>
    );
};

export default Tree;
