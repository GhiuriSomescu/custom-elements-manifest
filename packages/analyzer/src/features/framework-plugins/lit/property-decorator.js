import { decorator } from '../../../utils/index.js';
import { createAttributeFromField } from '../../analyse-phase/creators/createAttribute.js';
import { hasPropertyDecorator, isAlsoAttribute, getAttributeName } from './utils.js';

/**
 * PROPERTY
 * 
 * Handles the property decorator
 * @example @property({});
 */
export function propertyDecoratorPlugin() {
  return {
    name: 'CORE - LIT-PROPERTY-DECORATOR',
    analyzePhase({ts, node, moduleDoc}){
      switch (node.kind) {
        case ts.SyntaxKind.ClassDeclaration:    
          const hasDefaultModifier = node?.modifiers?.some(mod => ts.SyntaxKind.DefaultKeyword === mod.kind);
          const className = hasDefaultModifier ? 'default' : node?.name?.getText();
          const currClass = moduleDoc?.declarations?.find(declaration => declaration.name === className);
    
          /**
           * Find members with @property decorator
           */
          node?.members?.forEach(member => {
            if (hasPropertyDecorator(member)) {
              const propertyDecorator = member.decorators.find(decorator('property'));
              const propertyOptions = propertyDecorator?.expression?.arguments?.find(arg => ts.isObjectLiteralExpression(arg));
    
              /**
               * If property does _not_ have `attribute: false`, also create an attribute based on the field
               */
              if (isAlsoAttribute(propertyOptions)) {
                const field = currClass.members.find(classMember => classMember.name === member.name.getText());
                const attribute = createAttributeFromField(field);

                /**
                 * If an attribute name is provided
                 * @example @property({attribute:'my-foo'})
                 */
                const attributeName = getAttributeName(propertyOptions);
                if(attributeName) {
                  attribute.name = attributeName;
                }

                const existingAttribute = currClass?.attributes?.find(attr => attr.name === attribute.name);

                if(!existingAttribute) {
                  currClass.attributes.push(attribute);
                } else {
                  currClass.attributes = currClass?.attributes?.map(attr => attr.name === attribute.name ? ({...attr, ...attribute}) : attr);
                }
              }
            }
          });
          break;
        }
      }
  }
}
