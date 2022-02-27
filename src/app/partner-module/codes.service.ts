import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CodeModel } from '../models/CodeModel';

@Injectable({
  providedIn: 'root'
})
export class CodesService {
  constructor(private httpClient: HttpClient) {
  }

  public getCodes(): Observable<CodeModel[]> {
    return this.httpClient.get<CodeModel[]>('codes');
  }

  public getPaths(items: CodeModel[]): Observable<Map<string, string[]>> {
    const codePaths = new Map<string, string[]>();
    // init code paths
    this.processRecursive(items.filter(t => t.isRoot), undefined, (node, parent, depth) => {
      // we have problem sending the parent data into request because of circular dependencies
      // so we recreate the parent stuff
      node.display = node.codeDisplay;
      node.parent = parent;
      node.selected = false;
      node.id = `${node.id}`;
      if (parent) {
        node.groupBy = `${!!parent?.groupBy ? (parent.groupBy + ', ') : ''}${parent.codeDisplay}`;
      }
      if (parent) {
        codePaths.set(node.id, Object.assign([], codePaths.get(parent.id)));
      } else {
        codePaths.set(node.id, [node.id]);
      }
      depth > 0 && codePaths.get(node.id)?.push(node.id);
      return !!node.children;
    },
      (node, _) => node.children!, 0);

    return of(codePaths);
  }

  public processRecursive(
    codes: CodeModel[],
    parent: CodeModel | undefined,
    callback: (code: CodeModel, parent: CodeModel | undefined, depth: number) => boolean,
    next: (code: CodeModel, depth: number) => CodeModel[],
    depth: number = 0
  ): boolean {
    var map: any = {};
    codes.forEach((code) => map[code.id] = callback(code, parent, depth));
    codes?.filter(item => map[item.id]).forEach(code =>
      this.processRecursive(
        next(code, depth + 1) || [],
        code,
        callback,
        next,
        depth + 1)
    );
    return true;
  }
}
